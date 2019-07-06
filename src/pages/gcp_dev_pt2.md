---
path: "/gcp_dev_pt2"
date: "2019-07-04"
title: "GCP Developer Exam Study Guide - Part II"
---
Part 2 of 6  

*Last month I took the [Google Cloud Platform Professional Developer Exam](https://cloud.google.com/certification/cloud-developer). To prepare, I put together a study guide. I'm posting it here in five parts. Hopefully, it will help someone else with the exam. You can see the full study guide at my [GitHub](https://github.com/justwes2/gcp\_developer).*


#### Section 2: Building and Testing Applications
2.1 Setting up your development environment
- Emulating GCP services for local application development: With GCP's scalability, it is possible to have a dev environment where condition mirror production very closely. When that is not feasible, containers are a good way to make sure local dev matches the GCP environment very closely. Infrastructure as Code is a good tool to make sure resources are created the same way each time they are created, so that dev machines function closely matches prod function.
- Creating GCP projects: Projects are entities that contain and constrain resources. Every application should have a project per environment (dev, test, prod, etc). Projects allow for easy management of cost and access. 

2.2 Building a continuous integration pipeline:
- Creating a Cloud Source Repository and committing code to it: You can, but in a world with coca cola (github), why would you drink rite cola (CSR)? Source code repositories are a good thing. Use GCP's if it make sense for your org/project, but I can't find a use case where github wouldn't work just as well, if not better.
- Creating container images from code: Using docker (because what else would you use?), create a Dockerfile with the configurations needed for the container (base image, ports opened, scripts to run, etc). Use Cloud Build to build the image based on the Dockerfile:

    `gcloud builds submit --tag gcr.io/[PROJECT_ID]/[IMAGE_NAME] .`

    Run from the directory (cloudshell) where the Dockerfile is located. More in [Docs](https://cloud.google.com/cloud-build/docs/quickstart-docker)
- Developing unit tests for all code written: All major coding languages and frameworks have testing associated. Building tests into the build process is a good way to make sure poor quality code doesn't make it to deployment. There are a number of ways to implement testing. All code written should include tests in the PR before the code is merged or a ticket is closed. Code reviews are important to make sure that tests are adequate. There are tools to test test coverage. Once tests are being written and reviewed, the pipeline should run all tests before building new artifacts/deploying new versions. 
- Developing an integration pipeline using services (e.g. Cloud Build, Container Registry) to deploy the application to the target environment (e.g. development, testing, staging): For example, once PRs are merged into github/cloud source repository, a pipeline can build the container image, run all tests against the image, and if it passes, push the image into the container registry of the project associated with the desired environment- once a build in dev passes all tests, the image can be added to the container registry in the test account, for the testing team to vet, before approving to the production account. (Having a dedicated testing team is an anti-pattern in agile, but let's assume that not every team building pipelines in the cloud is perfectly Agile yet)
- Reviewing test results of a continuous integration pipeline: The goal of a CI pipeline is going to vary depending on context- some orgs will push for completely automated builds where the test results are logged somewhere, perhaps posted to slack, and life moves on. Others are going to need a workflow where once tests have run, they are reviewed by an approving entity before promotion. 

2.3 Testing
- Performance testing: Per [tutorialspoint](https://www.tutorialspoint.com/software_testing_dictionary/performance_testing.htm), performance testing is testing of system parameters under workload. Tests measure scalability, reliability, and resource usage. Performance testing techniques include Load testing, Stress testing, Soak testing, and Spike testing.
- [Integration testing](https://martinfowler.com/bliki/IntegrationTest.html): tests how well independently developed units function in the system, versus unit testing, which tests how the units of code behave. 
- [Load testing](https://www.digitalocean.com/community/tutorials/an-introduction-to-load-testing): A subset of peformance testing, this involves simulating high load on the resources and measuring how they respond. Do autoscaling groups scale? Can the load balancer handle all the requests? Is the database keeping up will all the reads and writes? These are things to look for in load testing. 

2.4 Writing Code
- Algorithm design: Wow, that's multiple semester's worth of material. When writing code, designing systems using the best algorithms will make systems more performant, decrease latency, and lead to a better user experience. There's a ton of content on that, like [this](https://www.geeksforgeeks.org/fundamentals-of-algorithms/). 
- Modern application patterns: In GCP, microservices is the big one. Layer or tiered models are also common- a web tier, a backend, and a database, for a simple example. Monoliths are still around, but in the context of the exam are proabably not considered modern. Most web frameworks support an MVC model- model-view-controller. This is similar to the tiered approach. More [here](https://techbeacon.com/app-dev-testing/top-5-software-architecture-patterns-how-make-right-choice)
- Efficiency: One quality of well designed systems is efficient- how much time/compute resources does it take to acheieve the desired output. Slack is a good example of an inefficient app- it can take gigs of ram on the client machine to run. 
- Agile methodology: its a thing. Sprints, stand ups, retros, scrum. 