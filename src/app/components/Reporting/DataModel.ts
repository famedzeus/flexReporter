import { Injectable } from "@angular/core";

@Injectable()
export class DataModel {
  /** Get headers for a source with given source GET URL */
  public getColumnsOfSource(sourceURL: string, cb){
    const req= new XMLHttpRequest();
    req.open("GET", sourceURL);
    req.onload = () => {
      cb(this.extractHeadersFromJSON(JSON.parse(req.response)));
    }
    req.send();
  }

  /** Get entitiy headers from JSON string */
  private extractHeadersFromJSON(json: JSON){
    let columns = [];
    let JSONString = JSON.stringify(json);
    // Take contents of first record
    JSONString = JSONString.substring(JSONString.indexOf("{")+1,JSONString.indexOf("}"));
    // Change double quotes to single quotes
    for(let i=0; i<JSONString.length; i++){
      if(JSONString.charAt(i) == '"'){
        JSONString = this.replaceAt(JSONString, i, "'");
      }
    }
    // Split this by comma to achieve - ['name': value, 'name': value, 'name': value ...]
    columns = JSONString.split(",");
    // For each element in the array take what's after the first single quote and before second single quote (i.e. the field name)
    for(let i in columns){
      // Note: second single quote is always one character before the colon
      columns[i] = columns[i].substring(1, columns[i].indexOf(":")-1);
    }
    return columns;
  }

  /** Replace a character of a string at a given index */
  private replaceAt(string: string, index: number, replace: string){
    return string.substr(0, index) + replace + string.substr(index + replace.length);
  }
  
  /** Get data */
  getData(URL: string, cb){
    const req= new XMLHttpRequest();
    req.open("GET", URL);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

  /** Join two JSON results on a field from each */
  joinResults(res1, res2, joinField1, joinField2){
    let joinedResult = [];
    for(let i in res1){
      for(let j in res2){
        if(res1[i][joinField1] == res2[j][joinField2]){
          joinedResult.push(Object.assign(res1[i], res2[j]));
        }
      }
    }
    return joinedResult;
  }
} 