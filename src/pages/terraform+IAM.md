---
path: "/terraform+iam"
date: "2019-09-30"
title: "Identity and Access Management as Code with Terraform"
---
*Adapted from [this](https://github.com/justwes2/terraforming-iam) project*

*This reflects Terraform .11, it has not been updated to v.12 yet*

When I first started in Cloud Engineering, as the low person on the totem pole, one of my jobs was babysitting the IAM policies in AWS. There were a few accounts, and a set of roles that were treated as 'standard' across the organization. They weren't of course. Developers in an account needed rights to set RDS parameter groups, another wanted to use the Code Pipeline suite, and so on. Unfortunately, that meant I spent more time than I wanted troubleshooting why things worked or didn't. When I had some spare cycles, I started in on converting all IAM resources into  Terraform modules. 

I ended up using nested modules here in as a prism- the main module called back to a refractor that called the same base resource (policy, role, group), but with a different aws account profile. That way, as new accounts were brought into this model, it was simple to add them to the refractor layer and get all resources plugged in. To add an account in the sample repo, add the following block to *ALL* `accounts.tf` files:

```
module "<PROFILE NAME>" {
    ...
    profile = "<PROFILE NAME>"
    ...
}
```

### Creating a policy

All policies are expressed in standard AWS json. For users who are not comfortable writing these policies freehand, AWS's IAM policy generator creates a json statement based on GUI input that can be copied into a `.json` file. All policy documents should be placed in the `modules/policy` directory. Then, in the `main.tf`, add a module:
```
module "<NAME OF POLICY>" {
    source = "./modules/accounts"
    name = "<NAME OF POLICY>"
    description = "<DESCRIPTION OF POLICY>"
    policy = "<NAME OF POLICY>.json"
}
```
Replace the name and description. Run `terraform apply`. The command should create a resource for each account listed. Easy peasy. 

### Creating a Role/Group

In this environments, SAML-based federated access was how users authenticated into the AWS Console. However, AWS CLI authentication was not integrated into the SAML/Active Directory federation scheme. Using a Terraform model like this solves that problem- roles and groups with the same name are hard coded to have the same policies attached. Because of the limitations of Terraform, each role/group must have its own directory in `/modules/roles`. The role directory should look like this:
```
<ROLE NAME>
    - role
        - role.tf
        - variables.tf
    - accounts.tf
    - variables.tf
```

The `accounts.tf` should list all accounts in the environment. Make sure that the role is configured to the SAML provider correctly- the specific configuration will vary by implementation, and we don't care about that here. A boilerplate is included in the example developer role. 
Ensure that a `group policy attachment` and a `role policy attachment` resource is created for each policy to be attached to the role/group. Note that policies managed by AWS will have `aws` in the ARN. For custom policies, use the `data.aws_caller_identity.current` resource. This resource is complied into the account number where the policy is deployed.
Finally, add a module to the `main.tf` like so:
```
module "<ROLE NAME>" {
    source = "./modules/roles/<ROLE NAME>"
    name = "<ROLE NAME>"
    description = "<ROLE DESCRIPTION>"
    policies = "[COMMA SEPARATED LIST OF POLICIES]"
}
```
Any policies that are managed by this framework should be referenced by calling the module like so: `module.<POLICY NAME>.name`. Calling it by name can lead to compile time errors. 

### EC2 Role
There is a role `bucket_access_role` listed as well. This creates a role which can be attached to an ec2 instance that allows access to the contents of the S3 bucket specified in the policy. Note that the `aws_iam_instance_profile` needs to be created to allow the role to be attached. 

### Conclusion
The advantages of Infrastructure as Code (Repeatability, Transparency, Audibility) are just as applicable to Identity and Access Management as to more traditionally defined infrastructure (compute, networking, storage). This framework was written for Terraform over Cloudformation. In a multi-cloud organization, a cloud agnostic tool like terraform can reduce complexity over a CSP specific tool like Cloudformation. 

There are a few drawbacks to this model. The refractor module needing to be repeated for each role is not DRY. This was needed since the module source cannot be a variable- so the middle tier cannot pull a different module for a role and a policy. There are more elegant ways to address this, and this should be streamlined when this model is adapted for the new version on Terraform. Also, Terraform cannot pull the length of a list and pass that in as an integer for a `count`. This model compensates for that by listing out the number of attachments per policy manually. Again, in the pending update, hard coding a number as a length variable is a DRYer solution. 