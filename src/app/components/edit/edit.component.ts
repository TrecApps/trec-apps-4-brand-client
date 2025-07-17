import { Component, ViewChild } from '@angular/core';
import { MarkdownEditorComponent } from '@tc/tc-ngx-general';
import { BRAND_RESOURCE_TYPE } from '../../model/BrandInfo';
import { ResourceService } from '../../services/resource.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, FormsModule, MarkdownEditorComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  resourceService: ResourceService;

  newKey: string = "";
  newVal: string = "";

  metaData: Map<string, string> = new Map<string, string>();
  

  permittedFileTypes = [
    "gif",
    "jpeg",
    "png",
    "svg",
    "webp"];

  @ViewChild("editor1")
  editor1: MarkdownEditorComponent | undefined;

  @ViewChild("editor2")
  editor2: MarkdownEditorComponent | undefined;

  brandTypes: string[] = [];

  constructor(rs: ResourceService) {
    this.resourceService = rs;

    for(let [key, value] of Object.entries(BRAND_RESOURCE_TYPE)){
      
      this.brandTypes.push(value);
    }
  }


  onShow(){
    this.metaData.clear();
    if(this.resourceService.editEntry){
      for(let key in this.resourceService.editEntry.metaData.metadata){
        this.metaData.set(key, this.resourceService.editEntry.metaData.metadata[key]);
      }
    } else {
      for(let key in this.resourceService.metadata?.metadata){
        this.metaData.set(key, this.resourceService.metadata.metadata[key]);
      }
    }
  }


  selectImage(event: any){
    let selectedFile = event.target.files[0]
    if(!selectedFile)return;

    let t = selectedFile.type.toLowerCase().trim();

    let selectedFileType = "";

    for(let possibleType of this.permittedFileTypes) {
      if(t == `image/${possibleType}`)
      {
        selectedFileType = possibleType;
        break;
      }
    }
    console.log("Selected File type is " + selectedFileType);

    selectedFile?.arrayBuffer().then((value: ArrayBuffer)=> {
      let buffer = new Uint8Array(value);

      const STRING_CHAR = buffer.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');

      let data = btoa(STRING_CHAR);

      let selectedImage = `data:image/${selectedFileType};base64,${data}`;

      if(this.resourceService.editEntry){
        this.resourceService.editEntry.metaData.profileBase64 = selectedImage;
      } else if(this.resourceService.metadata){
        this.resourceService.metadata.profileBase64 = selectedImage;
      }
    });
  }

  removeImage() {

    if(this.resourceService.editEntry?.metaData){
      this.resourceService.editEntry.metaData.profileBase64 = undefined;
    }
  }

  removeMetaDataEntry(key:string){
    this.metaData.delete(key);
  }

  addEntry() {
    if(this.newKey && this.newVal) {
      this.metaData.set(this.newKey, this.newVal);
    }

    this.newKey = "";
    this.newVal = "";
  }


  onSubmitNew() {
    if(!this.editor1 || !this.resourceService.editEntry) return;

    if(this.resourceService.editEntry.primaryType == ""){
      this.resourceService.editEntry.primaryType = undefined;
    }

    if(this.resourceService.editEntry.secondaryType == ""){
      this.resourceService.editEntry.secondaryType = undefined;
    }
    if(this.resourceService.editEntry.tertiaryType == ""){
      this.resourceService.editEntry.tertiaryType = undefined;
    }

    // this.resourceService.editEntry.contents = this.editor1.getContent().toString();
    this.resourceService.submitEntry(this.metaData);
  }

  updateMetadata(){
    this.resourceService.updateMetaData(this.metaData);
  }

  updateContents() {
    if(!this.editor2) return;

    this.resourceService.contents = this.editor2.content.toString();
    this.resourceService.updateContents();
  }

  updateName(){
    this.resourceService.updateName();
  }
}
