import taskLibrary = require("azure-pipelines-task-lib/task");
import fs = require("fs");
import armDeployTaskParameters = require("./inputValues");
import { TemplateObject, ParameterValue } from "./types";

export class DeploymentParameters {
    public properties: Object;
    public location: string;

    constructor(properties: Object, location?: string) {
        this.properties = properties;
        this.location = location? location : '';
    }

    public getDeploymentData(taskParameters: armDeployTaskParameters.InputValues): DeploymentParameters {
        let template : TemplateObject;
        let templateFile : string = '';
        let paramsFile : string = '';

        if (taskParameters.template && fs.existsSync(taskParameters.template)){
            
            templateFile = taskParameters.template;
        }
        else {
            console.log("File path does not exist: ",taskParameters.template);
        }

        let file = taskLibrary.findMatch(taskLibrary.getVariable("System.DefaultWorkingDirectory") as string, templateFile);
        let bufferTemplate = fs.readFileSync(file[0]);
        let fileContentsTemplate: string = bufferTemplate.toString("utf-8");

        template = JSON.parse(fileContentsTemplate);               

        if (taskParameters.templateParameters && fs.existsSync(taskParameters.templateParameters)){
            
            paramsFile = taskParameters.templateParameters;
        }
        else {
            console.log("File path does not exist: ",taskParameters.templateParameters);
        }

        file = taskLibrary.findMatch(taskLibrary.getVariable("System.DefaultWorkingDirectory") as string, paramsFile);
        let buffer = fs.readFileSync(file[0]);
        let fileContents: string = buffer.toString("utf-8");
        let params = JSON.parse(fileContents);

        let parameters =  params["parameters"] as Map<string, ParameterValue>; 
        
        // if (!taskParameters.overrideParameters) {
        //     parameters = this.updateOverrideParameters(taskParameters, parameters);
        // }

        var deploymentParameters = new DeploymentParameters({
            template: template,
            parameters: parameters
        });
        //deploymentParameters.updateCommonProperties(taskParameters.deploymentMode);
        return deploymentParameters;
    }

    // private updateOverrideParameters(taskParameters: armDeployTaskParameters.InputValues, parameters: Map<string, ParameterValue>): Map<string, ParameterValue> {
    //     var overrideParameters: NameValuePair[] = PowerShellParameters.parse(taskParameters.overrideParameters, true, "\\");
    //     for (var overrideParameter of overrideParameters) {
    //         if (taskParameters.addSpnToEnvironment) {
    //             if (overrideParameter.value === "$servicePrincipalId") {
    //                 overrideParameter.value = tl.getEndpointAuthorizationParameter(taskParameters.connectedService, 'serviceprincipalid', true);
    //             }
    //             if (overrideParameter.value === "$servicePrincipalKey") {
    //                 overrideParameter.value = tl.getEndpointAuthorizationParameter(taskParameters.connectedService, 'serviceprincipalkey', false);
    //             }
    //         }

    //         try {
    //             overrideParameter.value = this.castToType(overrideParameter.value, template.parameters[overrideParameter.name].type);
    //         } catch (error) {
    //             console.log(tl.loc("ErrorWhileParsingParameter", overrideParameter.name, error.toString()));
    //         }
    //         parameters[overrideParameter.name] = {
    //             value: overrideParameter.value
    //         } as ParameterValue;
    //     }
    //     return parameters;
    // }
}