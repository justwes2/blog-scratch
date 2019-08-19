---
path: "/terraform+ansible"
date: "2019-08-17"
title: "Hacking Ansible Inventory with Terraform"
---

#### The players
 [__Ansible__](https://docs.ansible.com/)

Ansible is a software configuration management framework. Users write playbooks of plays that set the state of a host- for the purposes of this post, a VM in the cloud space. Plays can also hit cloud provider apis to affect cloud infrastructure. Inventory of hosts managed by Ansible can be managed in a central Tower server. 

[__Terraform__](https://www.terraform.io/docs/index.html)

Terraform is a tool to provision infrastructure. Users create modules and call them with different parameters to create different types of resources. Details about existing infrastructure- called state- can be stored locally, or in a bucket in a cloud. In addition to providers for the major CSPs and some other technologies, Terraform can act on the local system in a number of ways. (I'm using Terraform 0.11 for the snippets here. Terraform .11 is more verbose, so it can be clearer to readers who are unfamiliar with HCL (Hashicorp Configuration Language).)

#### The problem

My first project using Ansible was to create a cluster of servers and set them up with different units of functionality- Easy enough. I wrote a playbook, using roles for each of the types of servers- front end, back end, auth server, and artifact repository. I was able to set up handlers to run interdependent tasks in sequence. Cool cool cool. For this use case, I decided I could store files that needed to be passed between the nodes on `localhost`- not a robust solution, but for this little cluster, it worked. 

Thing went somewhat awry when I needed to create and manage infrastructure. The Ansible Tower wasn't quite... working. I couldn't find anyone to give me details, but the gist that I got was that it wasn't an option for managing inventory. Okay. Fun. Users can manage inventory locally as well, using a `hosts.ini` file. 

I experimented with Ansible's `aws-ec2` module, but the approach seems more like scripting that idempotent desired state configuration*. When I created the EC2 resource, I had to either update the play and change the script from `state: present` to `state: absent`, or have another play to delete the vm. The former approach doesn't lend itself well to automation, and the latter can be daunting- The `delete_vm.yaml` play needs to have the instance id added for each instance, so after a few days of playing, I didn't have a way to spin resources up and down without manual intervention. 

I've since found ways to do this, but nothing was apparent while I was working on it. This post is really just _how_ to get Terraform to manage infrastructure, and Ansible to manage system configuration. Maybe an organization has a wealth of Terraform modules available for provisioning infrastructure, maybe the remote state is important to allow collaborative development of the infrastructure, I don't know. This post isn't about _why_ this would be done. 

#### The solution

I <3 Terraform. This is one of like four posts I have on my roadmap about it. It is fantastically useful way to manage infrastructure as code. It didn't take much for me to default back to building this cluster with Terraform. It was faster than calling a `create_vm.yaml` playbook _n_ times to build my cluster in the morning, and way more reliable to tear down than manually inserting the instance ids of my cluster in the `delete_vm.yaml` at the end of the day. But I still needed a way to pass the cluster IPs to Ansible to run the playbook. 

Enter the `local_file` Terraform resource. 

This creates a file on the local machine where Terraform runs- the same local machine that was orchestrating my Ansible cluster configuration playbook. I was able to create a resource like this

```
resource "local_file" "inventory" {
    filename = "./host.ini"
    content     = <<_EOF
    [frontend]
    ${module.frontend[0].private_ip}
    ${module.frontend[1].private_ip}
    ${module.frontend[2].private_ip}

    [backend]
    ${module.backend[0].private_ip}
    ${module.backend[0].private_ip}
    ${module.backend[0].private_ip}

    [auth_server]
    ${module.auth_server[0].private_ip}

    [artifact_repository]
    ${module.repository_server[0].private_ip}

    EOF
}
```

Now, whenever I run `terraform apply`, in addition to the servers I need for the cluster, I also have a file in my playbook where all the host information is found. Thus, I can run `ansible-playbook -i hosts.ini playbook.yaml` to run my playbook on all my hosts, and when I'm done for the day, I can run `terraform destroy` to clean up. No muss, no fuss, no editing playbooks, and no worrying that I'm terminating the wrong resource. 

#### Bonus- setting known hosts

Now, if you try to run Terraform and then Ansible, you may find that you need to add each host to your trusted hosts list before the playbook can run. Trying to do that for all hosts manually is tricky, so you can also use the `local_file` resource to create a bash script that does it for you:

```
resource "local_file" "host_script" {
    filename = "./add_host.sh"

    content = <<-EOF
    echo "Setting SSH Key"
    ssh-add ~/<PATH TO SSH KEYFILE>.pem
    echo "Adding IPs"

    ssh-keyscan -H ${module.frontend[0].private_ip} >> ~/.ssh/known_hosts
    ssh-keyscan -H ${module.frontend[1].private_ip} >> ~/.ssh/known_hosts
    ssh-keyscan -H ${module.frontend[2].private_ip} >> ~/.ssh/known_hosts
    ssh-keyscan -H ${module.backend[0].private_ip} >> ~/.ssh/known_hosts
    ssh-keyscan -H ${module.backend[1].private_ip} >> ~/.ssh/known_hosts
    ssh-keyscan -H ${module.backend[2].private_ip} >> ~/.ssh/known_hosts
    ssh-keyscan -H ${module.auth_server[0].private_ip} >> ~/.ssh/known_hosts
    ssh-keyscan -H ${module.repository_server[0].private_ip} >> ~/.ssh/known_hosts

    EOF

}
```

Now, building a multi-node cluster with Terraform's stateful management, and Ansible's handlers to run tasks in interdependent sequence, is as simple as `terraform apply`, `./add_host.sh`, and `ansible-playbook -i hosts.ini playbook.yaml`. 

*idempotency: In programming, the idea that running the same code twice will not change the end state. So, while `x = 2` is idempotent, `x += 2` is not. 

*desired state configuration: when managing infrastructure as code, DSC is a declarative format for state- `python should be installed` is declarative, `install python` is prescriptive. 