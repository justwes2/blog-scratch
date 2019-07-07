---
path: "/gcp_dev_pt3"
date: "2019-07-05"
title: "GCP Developer Exam Study Guide - Part III"
---
Part 3 of 6 

*Last month I took the [Google Cloud Platform Professional Developer Exam](https://cloud.google.com/certification/cloud-developer). To prepare, I put together a study guide. I'm posting it here in five parts. Hopefully, it will help someone else with the exam. You can see the full study guide at my [GitHub](https://github.com/justwes2/gcp\_developer).*


#### Section 3: Deploying applications
3.1 Implementing appropriate deployment strategies based on the target compute environment (Compute, GKE, GAE). Strategies include:

   - Blue/green deployments: create a new resource target (VM, managed VM group, K8s service, GAE service) and cut the load balancer/routing to the new version. 
   - Traffic-splitting deployments: create the two services as above, but instead of a total cutover, split the traffic between the two services. You can use this for A/B testing on UI changes, for example.
   - Rolling deployments: This process involves slowly replacing instances running the old version with new ones. 
   - Canary deployments: A small amount of traffic is sent to the new service. If there are any issues, that traffic can quickly be sent back to the stable version without widespread issues for end users.

As long as service resources are behind a google load balancer, most of these strategies can be supported for most compute services. 

3.2 Deploying applications and services on Compute Engine.
- Launching a compute instance using GCP Console and Cloud SDK (gcloud)(e.g., assign disks, availability policy, ssh keys):
   - In the [console](https://cloud.google.com/compute/docs/instances/create-start-instance)
   - Using gcloud:
   ```
   gcloud compute instances create [INSTANCE_NAME] \
   --image-family [IMAGE_FAMILY] \
   --image-project [IMAGE_PROJECT] \
   --subnet [SUBNET_NAME] \
   --zone [ZONE_NAME]
   ```
- Moving a persistent disk to a different VM: Detach the disk from the first VM (ensure the disk was unmounted so no data loss occurred), attach the disk to the new VM (you will then need to mount the disk inside the VM). If the target VM is in a different zone, use the `gcloud compute disks move` command.
- Creating an autoscaled managed instance group using an instance template: See the [Docs](https://cloud.google.com/compute/docs/instance-groups/creating-groups-of-managed-instances). tl;dr, you can create an instance template from an image- public or private. When creating the managed instance group, designate the desired template, and that is the image that will be used to autoscale the group.
- Generating/uploading a custom ssh key for instances: You can use [OS Login](https://cloud.google.com/compute/docs/instances/managing-instance-access) to manage ssh access to linux instances using IAM roles. If that is not an effective solution (not all users needing SSH access have IAM credentials), you can [manage ssh keys in metadata](https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys). Run the `gcloud compute project-info add-metadata` to add the users' public keys who should have access. 
- Configuring a VM for Stackdriver monitoring and logging: Install the [agent](https://cloud.google.com/logging/docs/agent/installation). You can [configure](https://cloud.google.com/logging/docs/agent/configuration) to agent, but it will function out of the box. You can access your logs in the console or via the api.
- Creating an instance with a startup script that installs software: Use the following command:
    ```
    gcloud compute instances create example-instance \
        --metadata-from-file startup-script=PATH/TO/FILE/install.sh
    ```
   You can store the file locally or in a bucket. More [info](https://cloud.google.com/compute/docs/startupscript)
- Creating custom metadata tags: You can attach tags/labels to resources to filter for cost, routing, access, and other functionality. More in the [Docs](https://cloud.google.com/compute/docs/labeling-resources).
- Creating a loadbalancer for Compute Engine instances: GCP offers a number of different load balancers, per [Docs](https://cloud.google.com/load-balancing/docs/load-balancing-overview):
    - [HTTPS](https://cloud.google.com/load-balancing/docs/https/): The most robust. Lots of features for routing rules, service based routing, global availability, and so on
    - SSL: Global, TCP with SSL offload, external
    - TCP Proxy: TCP without offload(doesn't preserve client IPs), global, external
    - Network TCP/UDP: No ssl offload, preserves client IPs, regional, external
    - Internal TCP/UDP: Regional, internal

3.3 Deploying applications and services on Google Kubernetes Engine.
- Deploying a GKE cluster: `gcloud container clusters create [arguments]`. [Clusters](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-cluster) can be zonal, regional, private (nodes not accessible on internet), and alpha (not recommended for public use)
- Deploying a containerized application to GKE: Create a [Deployment](https://cloud.google.com/kubernetes-engine/docs/concepts/deployment). A deployment is a set of identical pods running a set of containers defined in a manifest (YAML) file. Here's a [tutorial](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app)
-  Configuring GKE application monitoring and logging: [StackDriver](https://cloud.google.com/monitoring/kubernetes-engine/) supports monitoring for GKE. Legacy StackDriver (GA) and SD Kubernetes Monitoring (beta) are offered. There is a Stackdriver K8s Monitoring Console dashboard showing metrics. 
- Creating a load balancer for GKE instances: GKE supports TCP/UDP and HTTP(S) load balancers for public access. TCP load balancers are not aware of individual HTTP(S) requests, and do not feature health checks. HTTP(S) loadbalancers use Ingress, and are sensitive to requests to make context aware decisions. They feature URL maps the TLS termination. GKE automatically configures health checks. More [here](https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer). Internal load balancers are a service that can be configured like [so](https://cloud.google.com/kubernetes-engine/docs/how-to/internal-load-balancing). The service's `spec` will include `type: LoadBalancer` in the `service.yaml`. See example:
    ```
    apiVersion: v1
    kind: Service
    metadata:
    name: [SERVICE_NAME]
    annotations:
        cloud.google.com/load-balancer-type: "Internal"
    labels:
        [KEY]: [VALUE]
    spec:
    type: LoadBalancer
    loadBalancerIP: [IP_ADDRESS] # if omitted, an IP is generated
    loadBalancerSourceRanges:
    - [IP_RANGE] # defaults to 0.0.0.0/0
    ports:
    - name: [PORT_NAME]
        port: 9000
        protocol: TCP # default; can also specify UDP
    selector:
        [KEY]: [VALUE] # label selector for Pods to target
    ```

- Building a container image using Cloud build: Create a build config `.yaml` file, like [so](https://cloud.google.com/cloud-build/docs/configuring-builds/create-basic-configuration). Add steps to the file, will existing images, and arguments with specific instructions. Once the config file looks right, you can use the `images` field to determine where the build will be stored. 

3.4 Deploying  an application to App Engine. 
- Scaling configuration: You can set scaling to determine the inital number of instances (don't like the overlap of terminology), how instances are created or stopped, and how long an instance has to handle a request. You can use auto scaling for dynamic instances, manual scaling for resident instances, and basic scaling for dynamic instaces. For dynamic instances, the App Engine scheduler decides if a request can be managed by existing instances or if another one must be created. You can use metrics such as target_cpu_utilization, target_throughput_utilization, and max_concurrent_requests to optimize scaling. Each instance has its own queue of requests. Scaling is configured in the `app.yaml` for the version of the service. More [here](https://cloud.google.com/appengine/docs/standard/python/how-instances-are-managed).
- Versions: App Engine deployments are versioned. Traffic splitting can be done along versions for canary deployments. This streamlines rollback when issues arise.
- Blue/green deployment: Since deployments are versioned, you can cut 100% of traffic from one version of the deployment to the new one, once it has been approved for prod use. 

3.5 Deploying a Cloud Function
- Cloud Functions that are triggered via an event (e.g., Cloud Pub/Sub events, Cloud Storage object change notification events): When configuring a Cloud Function, it can subscribe to a pub/sub topic, and new writes can trigger the function, passing in information. Changes to objects in a bucket (upload, deletion, etc) can also trigger stuff.
- Cloud Functions that are invoked via HTTP: All Cloud Functions have an HTTP endpoint. Hitting that endpoint can trigger the function, and it will return the output of the function. More [here](https://cloud.google.com/functions/docs/calling/http).

3.6 Creating data storage resources
- Creating a Cloud Repository: Use github, or gitlab, or whatever. I defy you to show a use case where Cloud Repository is the best solution. In that [case...](https://cloud.google.com/source-repositories/docs/creating-an-empty-repository)
-  Creating a Cloud SQL instance: Can be [done](https://cloud.google.com/sql/docs/mysql/create-manage-databases) via the console, gcloud, or api.
- Creating composite indexes in Cloud Datastore: Composite indexes index multiple property values per indexed entity- they support complex queries and are defined in the index config file (`index.yaml`). These are needed for the following: 
    - Queries with ancestor and inequality filters
    - Queries with one or more inequality filters on a property and one or more equality filters on other properties
    - Queries with a sort order on keys in descending order
    - Queries with multiple sort orders
    - Queries with one or more filters and one or more sort orders

    Per [docs](https://cloud.google.com/datastore/docs/concepts/indexes)
- Creating BigQuery datasets: [Can be done](https://cloud.google.com/bigquery/docs/datasets#bigquery_create_dataset-cli) via the console, command line, or API. When creating a dataset, its location is immutable. 
- Planing and deploying Cloud Spanner: [Whitepapers](https://cloud.google.com/spanner/docs/whitepapers) for later. Create an instance, a database within the instance, and schema for tables within the DB and insert data, per [Docs](https://cloud.google.com/spanner/docs/quickstart-console). You can query and write to the DB via the gcloud sdk in nodejs, python, and go, [per](https://cloud.google.com/spanner/docs/use-cloud-functions#functions-calling-spanner-python). 
- Creating a Cloud Storage Bucket: Go to cloud storage, click 'create bucket', choose a globally unique name.
- Creating a Cloud Storage Bucket and selecting appropriate storage class: When creating bucket, select from one of: multiregional, regional, nearline, and coldline. You can set up lifecycle policies to turn older objects to cheaper classes. Not all objects in the bucket must be of the same class, but regional buckets and multi regional buckets cannot support the other class (but both support nearline and coldline).
- Creating a Pub/Sub topic: create the topic in the UI or programmatically, then create a subscription. You can push messages to the topic and pick them up via the subscription. 

3.7 Deploying and implementing networking resources
- Creating an auto mode VPC with subnets: An auto mode VPC will have a subnet in each region. Custom VPC can be created with subnets only in designated zones.

- Creating ingress and egress firewall rules for a VPC (e.g., IP subnets, Tags, Service accounts): Firewall rules can target traffic using the following conditions:
    - All instances in the network vs subnet (ingress only)
    - Instances with a matching network tag (a different entity than labels, a key value pair for grouping related resources)
    - Instances with a specific service account
    
    More [here](https://cloud.google.com/vpc/docs/firewalls)
- Setting up a domain using Cloud DNS: You will need to:
    - Get a domain name through a registrar. Google offers this service, but you can get it from others as well.
    - Get an IP address to point the A record to.
    - Create a managed public zone: a container for DNS records of the name suffix. It has a set of name servers that respond to queries. 
    - Create a managed private zone: like the public one, but only visible from specified VPCs.
    - Create the record for the IP address and the A record.
    - Create a CNAME record
    - Update domain name servers to push new records. 

    Find the full version [here](https://cloud.google.com/dns/docs/quickstart).

3.8 Automating resource provisioning with Deployment Manager

Personally I prefer cloud agnostic tools (see ongoing github/cloud repo feud). I would look to Jenkins, Terraform, and Chef for this. [But...](https://cloud.google.com/deployment-manager/docs/quickstart)

You define your resources in `.yaml` files. The file can contain templates, which are similar to terraform modules- boilerplate resources that can be called in the resource file. A template is written in python or jinja2. You deploy resources using `gcloud`. Once the resource collection has been created, a manifest is created. This file, like terraform state files, holds the desired state configuration. The manifest is updated to reflect updated runs of the the deployment file. You can destroy resources in the file the same way. There is a [repository](https://github.com/GoogleCloudPlatform/deploymentmanager-samples) of samples (hosted on github) for various types of resources. See the [Docs](https://cloud.google.com/deployment-manager/docs/fundamentals)

3.9 Managing Service accounts
- Creating a service account with a minimum number of scopes required: After creating the service account, it should be added to only the roles with the permissions it will need (principle of least privilege). For example, if a server needs to read data from files in a bucket, it should only have read rights to Cloud Storage, and no other rights. There is a private beta for IAM [Conditions](https://cloud.google.com/iam/docs/conditions-overview). See [Docs](https://cloud.google.com/iam/docs/granting-roles-to-service-accounts)
- Downloading and using a service account private key file: You can create a public/private key pair associated with a service role like [so](https://cloud.google.com/iam/docs/creating-managing-service-account-keys). Keys generated in the console vs the api will have slightly different structures. Make sure the workflow is standardized to avoid errors. This key can be used for non-GCP resources to authenticate into the environment with that service account's permissions. 