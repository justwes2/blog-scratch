---
path: "/gcp_dev_pt6"
date: "2019-07-08"
title: "GCP Developer Exam Study Guide - Part VI"
---
Part 6 of 6 

*Last month I took the [Google Cloud Platform Professional Developer Exam](https://cloud.google.com/certification/cloud-developer). To prepare, I put together a study guide. I'm posting it here in five parts. Hopefully, it will help someone else with the exam. You can see the full study guide at my [GitHub](https://github.com/justwes2/gcp\_developer).*



### Nota Bene:
- Bigtable not availible in all regions- can be global among availible regions 
- [Stackdriver](https://medium.com/google-cloud/tagged/stackdriver):
    - Trace: [trace](https://github.com/GoogleCloudPlatform/gke-tracing-demo#validation) to see the span of https requests in a SOA app. You can see what calls are taking the most time, and where the bottlenecks are (similar to [jaeger](https://www.jaegertracing.io/), the open source network tool). 
    - Debugger: This [tool](https://cloud.google.com/debugger/docs/quickstart) allows you to debug production applications. You can insert snapshots, which capture state (local vars and call stack) of an application at a specific line in the code. The snapshot will be taken when that line of code is hit while running. You can also request specific info, like `self.request.environ['HTTP_USER_AGENT']` in a snapshot. You can inject a debug logpoint, which lets you inject logging into a running app without restarting it. It can be configured for all GCP compute environments with most runtimes.
    - Monitoring: Usage and alerting(uptime checks, cpu usage, etc). Good overview [here](https://www.youtube.com/watch?v=IMsRWbYKJqg). Some monitoring needs an agent installed on the GCE vms. 
    - Profiler: after configuring [profiler](https://cloud.google.com/profiler/docs/quickstart) in an app, you can view the app in the profiler console. It will generate a flame graph for examining the data. Data can be viewed by service, and filtered on a number of catagories. The levels in the graph represent all processes, from the entire executable (100% of all resources used), down through the modules, into the specific funtions. The exact breakout will vary by runtime/language. Using profiler, you can identify specific funtions in an application that are consuming the most resources. These may be candidates for refactoring or other optimization.
    - Logging: [Logging](https://github.com/GoogleCloudPlatform/gke-tracing-demo#monitoring-and-logging) provides a single pane of glass to view platform and application logs. Based on bottlenecks identified in trace, you can filter the logs to view those related to the specific service that is performing poorly to determine what changes would best address issues.

_Based on [this](https://medium.com/@sathishvj/notes-from-my-beta-google-cloud-professional-cloud-developer-exam-e5826f6e5de1)_
- [Identity Aware Proxy](https://cloud.google.com/iap/): Sits on a load balancer, app engine, or kubernetes cluster to allow context specific access to resources. Part of a zero-trust network- each request is evaluated and approved or denied independently. Allows for greater access off site, to selected resources, use on mobile devices, and other flexiblity. Some information on [setup](https://medium.com/google-cloud/what-is-beyondcorp-what-is-identity-aware-proxy-de525d9b3f90) and [context](https://medium.com/google-cloud/how-to-get-cloud-identity-aware-proxy-up-and-running-547195f1fce3)
- [Endpoints](https://cloud.google.com/endpoints/docs/choose-endpoints-option): Per docs: An NGINX-based proxy and distributed architecture give unparalleled performance and scalability. Using an Open API Specification or one of our API frameworks, Cloud Endpoints gives you the tools you need for every phase of API development and provides insight with Stackdriver Monitoring, Trace and Logging.
    - Services you can use endpoints with:
        - Endpoints for OpenAPI: Most compute resources: App Enginestandard environment generation 1, App Engine, standard environment generation 2, App Engine flexible environment, Cloud Functions, Cloud Run, Compute Engine, GKE, Kubernetes, Other non-GCP
        - Endpoints for gRPC: Compute Engine, GKE, Kubernetes, Other non-GCP
        - Endpoints Frameworks: App Engine standard environment generation 1 Java 8 and Python 2.7 runtimes
    - How do you do [authentication/authorization](https://cloud.google.com/endpoints/docs/openapi/authentication-method): 
        - You can generate an API key to set a quota for requests- however, this is not a short lived token and is not as secure. 
        - [Firebase Authentication](https://firebase.google.com/docs/auth/) allows users to authenticate. 
        - Auth0 also allows authentication with a SAML token. 
        - For google users, the Google ID token authenticates against their google account. 
        - For automated calls and microservice architectures, a service account can be used. 
        - It is also possible to write your own custom authentication as long as it produces a valid json web token. 
        - You can also set up a [developer portal](https://cloud.google.com/endpoints/docs/openapi/dev-portal-overview) to allow developers to interact.

- 
- BigQuery:
    - reduce latency in queries: 
    - connect to services: 
    - load data from various sources:
    - validate query:
    - `bq` commands:
    - ACLs and service accounts: 
    - dataset is collection of tables
    - bq [access control](https://cloud.google.com/bigquery/docs/access-control): data viewer, metadata viewer, data editor, data owner
    <table>
  <tbody><tr>
    <th>Capability</th><th><code>dataViewer</code></th><th><code>dataEditor</code></th><th><code>dataOwner</code></th><th><code>metadataViewer</code></th><th><code>user</code></th><th><code>jobUser</code></th><th><code>admin</code></th>
  </tr>
  <tr>
    <td>List/get projects</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>List tables</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Get table metadata</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td><td>Yes</td>
  </tr>
    <tr>
    <td>Get table data</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Create tables</td><td>No</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Modify/delete tables</td><td>No</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Get dataset metadata</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Create new datasets</td><td>No</td><td>Yes</td><td>Yes</td><td>No</td><td>Yes</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Modify/delete datasets</td><td>No</td><td>No</td><td>Yes</td><td>No</td><td>Self-created<br> datasets</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Create jobs/queries</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td><td>Yes</td><td>Yes</td>
  </tr>
  <tr>
    <td>Get jobs</td><td>No</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Self-created<br> jobs</td><td>Any jobs</td>
  </tr>
  <tr>
    <td>List jobs</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Any jobs (jobs from other users are redacte</td><td>No</td><td>Any jobs</td>
  </tr>
  <tr>
    <td>Cancel jobs</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Self-created<br> jobs</td><td>Self-created<br> jobs</td><td>Any jobs</td>
  </tr>
  <tr>
    <td>Get/list saved queries</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Create/update/delete saved queries</td><td>No</td><td>No</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Create a read session via the BigQuery BigQuery Storage API</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Get transfers</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td><td>No</td><td>Yes</td>
  </tr>
  <tr>
    <td>Create/update/delete transfers</td><td>No</td><td>No</td><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td>
  </tr>
</tbody></table> 

[per](https://cloud.google.com/bigquery/docs/access-control#bigquery.jobUser)

- GKE commands:
    - `gcloud container clusters [COMMAND](https://cloud.google.com/sdk/gcloud/reference/container/clusters/)`:
        - create- Create a cluster for running containers.
        - delete- Delete an existing cluster for running containers.
        - describe- Describe an existing cluster for running containers.
        - get-credentials- Fetch credentials for a running cluster.
        - list- List existing clusters for running containers.
        - resize- Resizes an existing cluster for running containers.
        - update- Update cluster settings for an existing container cluster.
        - upgrade- Upgrade the Kubernetes version of an existing container cluster.
    - `kutectl`
    ```
    kubectl apply -f ./my-manifest.yaml           # create resource(s)
    kubectl apply -f ./my1.yaml -f ./my2.yaml     # create from multiple files
    kubectl apply -f ./dir                        # create resource(s) in all manifest files in dir
    kubectl apply -f https://git.io/vPieo         # create resource(s) from url
    kubectl create deployment nginx --image=nginx  # start a single instance of nginx
    kubectl explain pods,svc                       # get the documentation for pod and svc manifests

    # Get commands with basic output
    kubectl get services                          # List all services in the namespace
    kubectl get pods --all-namespaces             # List all pods in all namespaces
    kubectl get pods -o wide                      # List all pods in the namespace, with more details
    kubectl get deployment my-dep                 # List a particular deployment
    kubectl get pods --include-uninitialized      # List all pods in the namespace, including uninitialized ones
    kubectl get pod my-pod -o yaml                # Get a pod's YAML
    kubectl get pod my-pod -o yaml --export       # Get a pod's YAML without cluster specific information

    # Describe commands with verbose output
    kubectl describe nodes my-node
    kubectl describe pods my-pod

    kubectl get services --sort-by=.metadata.name # List Services Sorted by Name

    kubectl set image deployment/frontend www=image:v2               # Rolling update "www" containers of "frontend" deployment, updating the image
    kubectl rollout undo deployment/frontend                         # Rollback to the previous deployment
    kubectl rollout status -w deployment/frontend                    # Watch rolling update status of "frontend" deployment until completion

    kubectl label pods my-pod new-label=awesome                      # Add a Label
    kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # Add an annotation
    kubectl autoscale deployment foo --min=2 --max=10                # Auto scale a deployment "foo"

    kubectl delete -f ./pod.json                                              # Delete a pod using the type and name specified in pod.json
    kubectl delete pod,service baz foo                                        # Delete pods and services with same names "baz" and "foo"
    kubectl delete pods,services -l name=myLabel                              # Delete pods and services with label name=myLabel
    kubectl delete pods,services -l name=myLabel --include-uninitialized      # Delete pods and services, including uninitialized ones, with label name=myLabel
    kubectl -n my-ns delete po,svc --all   

    ```
    [per](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
    - start/stop: `gcloud container clusters resize $CLUSTER --size=0 --zone=$ZONE`
    - bring up cluster: `gcloud container clusters create <OPTIONS>`
    - add nodes: `gcloud container clusters resize [CLUSTER_NAME] --node-pool [POOL_NAME] --num-nodes [NUM_NODES]`
    - Error codes:
        - 400- Your Compute Engine and/or Kubernetes Engine service account has been deleted or edited. When you enable the Compute Engine or Kubernetes Engine API, a service account is created and given edit permissions on your project. If at any point you edit the permissions, remove the account entirely, or disable the API, cluster creation and all management functionality will fail. [per](https://cloud.google.com/kubernetes-engine/docs/troubleshooting)
        - 403- Forbidden by RBAC
    - pipeline integration
- Cloud SQL
    - scale between regions- can't do it... can failover, but 
    - roles: admin, editor, viewer, client
    - connect w/ ssl or w/o ssl
    - migrate from on prem (case study)
        - csv or sqldump
    - Cloud SQL not HA cross regionally
        - read replicas in same zone
        - failover replicas in same region
        - [More](https://cloud.google.com/sql/docs/mysql/high-availability)
        - For global reachablity, switch to Spanner
- Cloud Spanner:
    - use case: global availiblity, ACID++
    - minimize costs:
        - configuration: instance configuration defines the geographic placement and replication of the databases in that instance. When you create an instance, you must configure it as either regional (that is, all the resources are contained within a single GCP region) or multi-region 
        - node count: Each node provides up to 2 TiB of storage. The peak read and write throughput values that nodes can provide depend on the instance configuration, as well as on schema design and dataset characteristics
        - [More](https://cloud.google.com/spanner/docs/instances)
- IAM:
    - customize permissions for hybrid access
- Cloud build: Its Jenkins. ¯\\_ _(ツ)_ _/¯
    - build steps can be defined in yaml (or json):
    ```
    steps:
    - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/my-project/my-image', '.']
    timeout: 500s
    - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/my-project/my-image']
    - name: 'gcr.io/cloud-builders/kubectl'
    args: ['set', 'image', 'deployment/my-deployment', 'my-container=gcr.io/my-project/my-image']
    env:
    - 'CLOUDSDK_COMPUTE_ZONE=us-east4-b'
    - 'CLOUDSDK_CONTAINER_CLUSTER=my-cluster'
    options:
        machineType: 'N1_HIGHCPU_8'
    timeout: 660s
    tags: ['mytag1', 'mytag2']
    images: ['gcr.io/my-project/myimage']
    ```
- Deployment manager template



### Glossary (terms I don't know/Stuff I need to understand better):
- [Cloud Memorystore](https://cloud.google.com/memorystore/docs/redis/): managed redis service. [Redis](https://redis.io/) is an in-memory data structure store. 
- [SQL Union operator](https://www.techonthenet.com/sql/union.php): The UNION operator combines results of two or more SELECT statements. The statements must have the same number of columns, be of similar data types, and the columns must be in the same order. Use UNION ALL to get all values, not just the distinct ones. 
- [SQL Cross Join](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#join-types): produces a set that is the number or rons in the first table multiplied by the number of rows in teh section table, aka a Cartesian Product. If a WHERE clause is used, it becomes an inner join. For example, this can combine an inventory table with a store list to create a table for inventory at all stores. 
- SQL [Unnest](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#unnest):takes an array and returns a table with one row for each element in the array. 
    ```
    SELECT *
    FROM UNNEST(ARRAY<STRUCT<x INT64, y STRING>>[(1, 'foo'), (3, 'bar')]);

    +---+-----+
    | x | y   |
    +---+-----+
    | 3 | bar |
    | 1 | foo |
    +---+-----+
    ```
- [Service Mgmt Api](https://cloud.google.com/service-infrastructure/docs/service-management/reference/rest/): allows service producers to publish their services on Google Cloud Platform so that they can be discovered and used by service consumers. [See more](https://cloud.google.com/service-infrastructure/docs/service-management/getting-started)
- [Wireshark](https://www.wireshark.org/): a network protocol analyzer. 
- [Cloud tasks](https://cloud.google.com/tasks/docs/): manage large numbers of async, distributed tasks by setting up queues.
- Cloud Composer
- DataStore Queries
- VPC flow logs
- [VPC service controls](https://cloud.google.com/vpc-service-controls/docs/)- Allows user to constrain managed services (buckets, BigTable, BigQuery) within VPC
- [Cloud Armor](https://cloud.google.com/armor/)- defense at scale against DDoS attacks
- [Cloud Identity-Aware Proxy](https://cloud.google.com/iap/docs/)- Uses identity and context to allow secure auth without VPN. Works for App Engine, Compute and GKE