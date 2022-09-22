--- 
description: "Code and tutorial for Rock-paper-scissors game used at Azure Custom Vision hands-on workshop"
languages: 
  - javascript
page_type: sample
products: 
  - azure
  - azure-cognitive-services
urlFragment: rock-paper-scissors-customvision
---

# Rock-paper-scissors
Code and tutorial for "Rock-paper-scissors" game used at Azure Custom Vision hands-on workshop.

## Contents

Outline the file contents of the repository. It helps users navigate the codebase, build configuration and any related assets.

| File/folder       | Description                                |
|-------------------|--------------------------------------------|
| `Step{1-7}`       | Sample source code.                        |
| `.gitignore`      | Define what to ignore at commit time.      |
| `README.md`       | This README file.                          |
| `LICENSE`         | The license for the sample.                |

# Prerequisites

1. Azure Subscribtion
2. Published Custom Vision iteration and access key
3. [NodeJS](https://nodejs.org/en/download/)

# Setup

## Azure Subscription

### Open Azure Portal - https://portal.azure.com
### Create a new resource group
* Open "Resource groups" module and add new resource group

  ![Add new resource group](assets/screenshots/0_resource_group_blank.JPG "Add new resource group")
  
* Fill-in the form (Subscription - <your_subscription>, Resource group - "RPS_ResourceGroup", Region - "West Europe")

  ![Fill-in the form](assets/screenshots/0_resource_group_new.JPG "Fill-in the form")

* Click "Review + create"
* Verify the values and click create

  ![Verify the values and click create](assets/screenshots/0_resource_group_new_valid.JPG "Verify the values and click create")

* Wait until resource group is create and click "Go to resource group"

  ![Wait until resource group is create and click "Go to resource group"](assets/screenshots/0_resource_group_goto.JPG "Wait until resource group is create and click Go to resource group")

### Create a new Custom Vision resource
* Create new resource

  ![Create new resource](assets/screenshots/0_resource_group_list_res_blank.JPG "Create new resource")

* Search for "Custom Vision" in the Marketplace and click on it

  ![Search for "Custom Vision" in the Marketplace and click on it](assets/screenshots/0_resource_search.JPG "Search for Custom Vision in the Marketplace and click on it")

* Click Create

  ![Click Create](assets/screenshots/0_resource_customvision_new.JPG "Click Create")

* Fill-in the form (Name - "RPSCustomVision", Subscription - <your_subscription>, Resource group - "RPS_ResourceGroup", Location - for training and predition - "West Europe", Pricing tiers for training and predition - "F0") and click create. Wait until resource is created

  ![Fill-in the form and click create](assets/screenshots/0_resource_customvision_settings.png "Fill-in the form and click create")

### Create a new AppService resource
* Open your resource group and verify that you now have two resources with "Cognitive Service" type and click "Add" to add another resource

  ![Open your resource group and verify that you now have two resources with "Cognitive Service" type and click "Add" to add another resource](assets/screenshots/0_resource_group_list_cv.JPG "Open your resource group and verify that you now have two resources with Cognitive Service type and click Add to add another resource")

* Search for "Web App" in the Marketplace and click on it

  ![Search for "Web App" in the Marketplace and click on it](assets/screenshots/0_resource_search_webapp.JPG "Search for Web App in the Marketplace and click on it")

* Click Create

  ![Click Create](assets/screenshots/0_resource_search_webapp.JPG "Click Create")

* Fill-in the form (Subscription - <your_subscription>, Resource group name - "RPS_ResourceGroup", Name - <choose_unique_name>, Publish - "Code", "Runtime stack" - "Node 12", Operating system - "Windows", Region - "West Europe") and click "Change size" for App Service Plan

  ![Fill-in the form and and click "Change size" for App Service Plan](assets/screenshots/0_resource_webapp_settings_1.png "Fill-in the form and and click Change size for App Service Plan")

* Select "Dev / Test" plan and "F1" pricing tier, then click "Apply"

  ![Select "Dev / Test" plan and "F1" pricing tier, then click "Apply"](assets/screenshots/0_resource_webapp_settings_2.JPG "Select Dev/Test plan and F1 pricing tier, then click Apply")

* Click "Review + create"

  ![Click "Review and create"](assets/screenshots/0_resource_webapp_settings_3.png "Click Review + create")

* Verify values and click "Create"

  ![Verify values and click "Create"](assets/screenshots/0_resource_webapp_valid.JPG "Verify values and click Create")

* Wait for Web App deployment

  ![Wait for Web App deployment](assets/screenshots/0_resource_webapp_deployment_wait.JPG "Wait for Web App deployment")

* Open your resource group and verify that you have the following resources: App Service Plan, App Service and two Cognitive Services

  ![Open your resource group and verify that you have the following resources: App Service Plan, App Service and two Cognitive Services](assets/screenshots/0_resource_group_list_final.JPG)

* Open your new Web App, go to "Configuration" -> "Application Settings" 

  ![Open your new Web App, go to Configuration -> Application Settings](assets/screenshots/0_resource_webapp_settings.png)

* Click "New application setting"

  ![Click New application setting](assets/screenshots/0_resource_webapp_settings_new.png)
  
* Setting name is "SCM_DO_BUILD_DURING_DEPLOYMENT" and value "true"

  ![Setting name is SCM_DO_BUILD_DURING_DEPLOYMENT and value true](assets/screenshots/0_resource_webapp_settings_new_form.png)

* Click "OK"

  ![Click OK](assets/screenshots/0_resource_webapp_settings_new_form_ok.png)

* Click "Save"

  ![Click Save](assets/screenshots/0_resource_webapp_settings_updated_save.png)

* This will enable build step when we deploy our NodeJS application later

## Custom Vision

### Sign in https://www.customvision.ai/ using created Azure account 
  ![Sign in https://www.customvision.ai/ using created Azure account](assets/screenshots/0_customvision_signin.JPG)
### Create a new Custom Vision project
* Click "New Project"

![Click "New Project"](assets/screenshots/0_customvision_projects_blank.png)

* Fill-in the form (Name - "RPS", Resource - "RPSCustomVision[F0]", Project Type - "Classification", Classification Types - "MMulticlass", Domains - "General") and click "Create project"

![Fill-in the form and click "Create project"](assets/screenshots/0_customvision_projects_new.JPG)

### Upload and tag images
* In Custom Vision project click "Add images"

![In Custom Vision project click "Add images"](assets/screenshots/0_customvision_project_addimages.JPG)

* Add images, select appropriate tag (e.g. paper) and click "Upload files"

![Add images, select appropriate tag (e.g. paper) and click "Upload files"](assets/screenshots/0_customvision_project_addimages_paper.JPG)
* Wait until upload is finished

![Wait until upload is finished](assets/screenshots/0_customvision_project_addimages_uploading.JPG)
![Wait until upload is finished](assets/screenshots/0_customvision_project_addimages_uploaded.JPG)

* Repeat for the other folders, wait until all images are uploaded

### Train a model
* In Custom Vision project click "Train"

![In Custom Vision project click "Train"](assets/screenshots/0_customvision_project_train.JPG)

* Select "Quick Training" and click "Train"

![Select "Quick Training" and click "Train"](assets/screenshots/0_customvision_project_train_setup.png)

* Wait for training to finish

![Wait for training to finish](assets/screenshots/0_customvision_project_train_done.JPG)

### Manual validation

* Click on "Quick Test"

![Click on "Quick Test"](assets/screenshots/0_customvision_project_iteration_quicktest.JPG)

* Upload test image

![Upload test image](assets/screenshots/0_customvision_project_iteration_quicktest_results.JPG)

### Prediction correction

* Click on "Predictions"

![Click on "Predictions"](assets/screenshots/0_customvision_project_iteration_predictions.JPG)

* Select incorrectly predicted image

![Select incorrectly predicted image](assets/screenshots/0_customvision_project_iteration_predictions_list.JPG)

* Assign correct tag and click "Save and close"

![Select incorrectly predicted image](assets/screenshots/0_customvision_project_iteration_predictions_detail.JPG)

### (Optional) Advanced training
* In Custom Vision project click "Train"

![In Custom Vision project click "Train"](assets/screenshots/0_customvision_project_train.JPG)

* Select "Advanced Training" for 1 hour and click "Train"

![Select "Advanced Training" for 1 hour and click "Train"](assets/screenshots/0_customvision_project_train_setup_adv.JPG)

* Wait for training to finish

![Wait for training to finish](assets/screenshots/0_customvision_project_train_done.JPG)

### Publish iteration
* Open "Performance" tab, select finished iteration and click "Publish"

![Wait for training to finish](assets/screenshots/0_customvision_project_iteration_publish.JPG)

* Fill-in model name, select "RPSCustomVision_Prediction" as prediction resource and click "Publish"

![Fill-in model name, select "RPSCustomVision_Prediction" as prediction resource and click "Publish"](assets/screenshots/0_customvision_project_iteration_publish_setup_1.JPG)
![Fill-in model name, select "RPSCustomVision_Prediction" as prediction resource and click "Publish"](assets/screenshots/0_customvision_project_iteration_publish_setup_2.JPG)

* Click on "Prediction URL" to see your credentials

![Wait for training to finish](assets/screenshots/0_customvision_project_iteration_prediction.JPG)


## Web application code
Application based on code from [NodeJS app on Azure](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs) example.

### Structure

* index.js - server-side logic
* public/index.html - WebApp HTML template
* public/css/app.css - WebApp CSS styles
* public/js/app.js - WebApp Javascript logic

### Local development 
Local development is the same for all the steps:
1. Open "StepN" folder
2. Run `npm install`
3. Run `npm start`
4. Open http://localhost:1337

### Azure deployment 
Azure deployment is the same for all the steps:
1. Open "StepN" folder
2. Create zip archive with contents of "StepN" folder, except for node_modules folder
3. Open <choose_unique_name>.scm.azurewebsites.net
4. navigate to Tools -> Zip Push Deploy
5. Drag-and-drop zip archive to /wwwroot
6. Open <choose_unique_name>.azurewebsites.net and verify that site is running

Code changes are described in respective steps:

- [Step 1](Step1/README.md): After cloning the repository, you can either choose to develop locally or deploy to Azure

- [Step 2](Step2/README.md): Initalize camera, take a picture, and store it in canvas element

- [Step 3](Step3/README.md): Submit and receive a picture to `index.js`. Then, submit picture from `index.js` to Custom Vision API. Finally, receive predictions from Custom Vision

- [Step 4](Step4/README.md): Return best match prediction to client-side and render result to HTML page

- [Step 5](Step5/README.md): Add AI opponent and show opponents move

- [Step 6](Step6/README.md): Visualize counter and show results

- [Step 7](Step7/README.md): Download the Custom Vision model and use it locally with `tensorflow.js`


# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
