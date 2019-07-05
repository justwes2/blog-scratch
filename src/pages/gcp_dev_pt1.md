---
path: "/gcp_dev_pt1"
date: "2019-07-03"
title: "GCP Developer Exam Study Guide - Part I"
---
*Last month I took the [Google Cloud Platform Professional Developer Exam](https://cloud.google.com/certification/cloud-developer). To prepare, I put together a study guide. I'm posting it here in five parts. Hopefully, it will help someone else with the exam. You can see the full study guide at my [GitHub](https://github.com/justwes2/gcp\_developer).*

#### Section 1: Designing highly scalable, available, and reliable cloud-native applications
1.1 Designing performant applications and APIs
- IaaS vs Container as a Service vs PaaS (e.g. autoscaling implications)
    - IaaS: VMs, managed service groups for autoscaling, can configure for HA, failover
    - CaaS: GCE, autoscaling, failover, etc managed
    - PaaS: Cloud Functions, all ops managed by platform, infinitely scalable
- Portability vs. platform-specific design: As a rule, the more a solution is 'managed', the less portable it is. VMs move as images across providers fairly well, but Serverless Functions must be rewritten to accommodate the specific CSP. Containers are an interesting case- the container itself is designed to be portable, and K8s should be portable by design. (Not enough exposure to validate)
- Evaluating different services and technologies: Things to look for:
    - Level of mgmt: as services are more managed, it decreases ops workload. However, sometimes this sacrifices flexibility for more specialized configuration. (I.e. a managed DB service patches according to the service's schedule, not when the app is ready to support(not a great ex, but that's the idea)
    - Cost: TCO, managed services can be more expensive, but *can* deliver more value. 
    - HA/DR/Failover options: is the tech regional? Can it support multiregional solutions? How much of that is managed
- Operating system versions and base runtimes of services:
    - VMs: Marketplace images support most anything you can imagine, if its not there, roll your own image. 
    - Containers: GAE Standard supports: Python 2.7/3.7, Java 8, PHP 5.5/7.2, Go 1.9/1.11, and Nodejs (not sure what version). GAE also supports custom containers with flexible runtimes. 
    - Cloud Functions: Node.js 6/8, Python 3.7, Go 1.11
    - Cloud SQL: MySQL 5.5/5.6/5.7, Postgres 9.6
- Geographic distribution of Google Cloud services: GCP has a bunch of regions, adding more all the time. Each region has at least 2 zone, which are separate- but often on a shared campus. VPCs can span regions, subnets can span zones. Different services have different geographic coverage- not everything is available in all regions.
- Microservices: Unlike traditional 'monoliths', microservice architectures involve units of functionality being broken up and managed separately. By loosely coupling systems, app teams can move more quickly, and update services in smaller, tighter release cycles.
- Defining a key structure for high write applications using Cloud Storage, Cloud BigTable, Cloud Spanner, or Cloud SQL: All of these services are managed to different degrees. Ensuring that the key will not result in lots of write activity in a single shard of the database/storage (hotspotting) is essential. The best key will depend on the nature of the data and the application/queries. If a shard is getting 'hot', consider hashing additional information into the key to break up the writes.
- Session management: Managed services like GAE and GKE, as well as google's load balancers, have sticky session as a managed feature so that users will interact with the same container throughout the duration of an interaction, to improve performance. 
- Deploying and securing an API with cloud endpoints: Endpoints is an API Gateway style api manager that allows logging, securing, and monitoring of endpoints. It is available in OpenAPI, gRPC, and App Engine standard flavors. See the [Docs](https://cloud.google.com/endpoints/docs/)
- Loosely coupled applications using asynchronous Cloud Pub/Sub events: Having services push to pub/sub allows supports reliable, scalable service designs. Once an events is written to a pub/sub subscription, a worker of whatever flavor will pick it up when able. This prevents data loss if a service is unavailable. Additionally, if an event is not marked as completed before it times out, it will be picked up by another worker. This prevents data loss when workers fail or error out. The default acknowledgement window is 10 sec, but can expand to 10 min. 
- Health checks: Managed instance groups and K8s use health checks to ensure availability. If a vm or container fails a health check, those services can spin up another resource to ensure healthy compute resources are always available
- Google-recommended practices and documentation: Google has lots of docs full of lots of opinions. Good luck with that. Most service docs will have a best practices page/section to refer to. 

1.2 Designing secure applications
- Applicable regulatory requirements and legislation: Varies depending on location (GDPR), industry (HIPPA), and other stuff. See [Docs](https://privacy.google.com/businesses/compliance/#!?modal_active=none)
- Security mechanisms that protect services and resources: varies from service to service. IAM can be used to limit user access and communication between resources. Ensure that buckets aren't public, firewalls aren't open. 
- Storing and rotating secrets: IAM service account keys are automatically rotated. GCP's [Secrets Management](https://cloud.google.com/solutions/secrets-management/) can be used for other secrets. Rotate your keys/secrets. Third party products like vault also exist- not sure google cares.
- IAM roles for users/groups/service accounts: All IAM entities can be assigned a role at the project level (can also be asigned at the folder or org level). Using roles can limit access to principle of least privilege. 
- HTTPS certificates: You can put an SSL cert on a load balancer for HTTPS traffic. GCP will manage certs, or you can bring your own. You can also attach an SSL cert to an App Engine
- Google-recommended practices and documentation: [tl;dr](https://cloud.google.com/docs/enterprise/best-practices-for-enterprise-organizations#secure-apps-and-data): Ensure VPCs are secured (service controls), put HTTPS load balancing in place, use Cloud Armor service, Use Cloud Identity-Aware Proxy service
1.3 Managing application data: 
- Defining database schema for Google-managed databases (Datastore, Spanner, BigTable, BigQuery): 
    - [Datastore](https://cloud.google.com/datastore/docs/concepts/entities): objects are called entities, entities have properties. Doesn't need schema upfront. Doc DB will just hold hierarchical info by unique key. 
    - [Spanner](https://cloud.google.com/spanner/docs/schema-and-data-model): Much like traditional SQL db. Specify schema of table on creation. Data strongly typed. Can define secondary indexes.
    - [BT](https://cloud.google.com/bigtable/docs/schema-design): Very similar to RDBMS. Each table has one index- the row key. Rows are sorted lexicographically by row key. All operations are atomic at the row level. Reads and writes should be distributed evenly across table. Keep all info for entity in single row. Related entities should be stored in adjacent rows. BT tables are sparse (create lots of mostly empty columns)
    - [BQ](https://cloud.google.com/bigquery/docs/schemas): specific when you load data into table and when you create empty table. Can auto-generate schema, or retrieve from source.
- Choosing data storage options based on use case considerations:
    - Cloud storage signed URLs for user uploaded content: provide user with a URL to get access to a bucket for a set duration without needing to provide a google account. [Docs](https://cloud.google.com/storage/docs/access-control/signed-urls)
    - Using Cloud Storage to run a static website: Connect bucket to Cloud DNS address to serve static content (usually based on an `index.html`). All website content must be publicly accessible for this to work.
    - Structured vs. Unstructured data: Structured data should go somewhere relational- SQL/Spanner, unstructured should go Datastore or BT (for massive IoT streaming datasets)
    - ACID Transactions vs. analytics processing: Spanner offers ACID++, SQL is ACID, Datastore is ACID, BT is **not** ACID, BQ is ACID
    - Data volume: [Persistent disk](https://cloud.google.com/compute/docs/disks/) popped into my head, but probably more about [quantity](https://cloud.google.com/solutions/transferring-big-data-sets-to-gcp) of data. 
    ![alt text](https://cloud.google.com/solutions/images/tran5.png "data transfer")
    Use `gsutil` for smaller amounts, google transfer service for GCS or other CSP, and get a transfer appliance for large amounts of data in a datacenter
    - Frequency of data access in Cloud Storage: Multiregional, Regional, Nearline, Coldline
- Working with data ingestion systems (Cloud pub/sub, storage transfer service):
    - Pub/Sub: subscription messaging system: Data is published to subscription, picked up, processed, and deleted
    - Storage transfer service: Hits http endpoints to sync data with other cloud blob storage solutions (S3)
- Following google-recommended practices and docs: service by service. [Cloud Spanner](https://cloud.google.com/spanner/docs/best-practice-list)
1.4 Re-Architecting applications from local services to Google Cloud Platform
- Using managed services: Managed services are a gradient (VM->Managed VM group->GKE->GCE->Cloud Functions). Using managed services reduces ops overhead/costs. Managed services are more expensive, usually. Additionally, managed services are not as flexible in some cases.
- Using the strangler pattern for migration: The [strangler pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/strangler) is where a legacy application is migrated in pieces. A specific unit of functionality is identified, rearchitected, and replaced. Then another piece of functionality is identified, and the pattern repeats until the entire application has been migrated/modernized, and the old system can be decommissioned.  
- Google-recommended practices and documentation: Building scalable and resilient applications: [docs](https://cloud.google.com/solutions/scalable-and-resilient-apps). There are some whitepapers [here](https://cloud.google.com/solutions/migration-center/)