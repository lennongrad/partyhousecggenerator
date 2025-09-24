import { Component, ElementRef, ViewChild } from '@angular/core';
import { CardTextService } from '../card-text.service';
import { CardEditorService } from '../card-editor.service';
import { CardData, CardResource, UnitStats } from '../carddata';
import { CommonModule, KeyValuePipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [CommonModule, KeyValuePipe, NgForOf],
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.less']
})
export class CardEditorComponent {
  // text inputs
  @ViewChild('name', { static: true }) nameElement!: ElementRef;
  @ViewChild('url', { static: true }) urlElement!: ElementRef;
  @ViewChild('text', { static: true }) textElement!: ElementRef;
  @ViewChild('vp', { static: true }) vpElement!: ElementRef;
  @ViewChild('textSize', { static: true }) textSizeElement!: ElementRef;
  // stats inputs
  @ViewChild('haveStats', { static: true }) haveStatsElement!: ElementRef;
  @ViewChild('statsPop', { static: true }) statsPopElement!: ElementRef;
  @ViewChild('statsCash', { static: true }) statsCashElement!: ElementRef;
  @ViewChild('statsTrouble', { static: true }) statsTroubleElement!: ElementRef;
  @ViewChild('statsStar', { static: true }) statsStarElement!: ElementRef;
  // abilities
  @ViewChild('abilitiesList', { static: true }) abilitiesListElement!: ElementRef;

  lastStats?: UnitStats;

  getCard(): CardData{
    return this.editorService.getCurrentCard();
  }

  // text inputs
  nameKey(event: any){
    this.getCard().name = event.target.value;
  }
  urlKey(event: any){
    this.getCard().imageURL = event.target.value;
  }
  textKey(event: any){
    this.getCard().text = event.target.value;
  }
  vpKey(event:any){
    if(event.target.value != "" && !isNaN(Number(event.target.value))){
      this.getCard().vp = Number(event.target.value);
    } else {
      this.getCard().vp = undefined;
    }
  }
  textSizeKey(event:any){
    this.getCard().textSizeModifier = Number(event.target.value);
  }

  saveCard() {
    this.editorService.saveCard()
  }
  getAllCards(): Array<CardData> {
    return this.editorService.allCards
  }
  loadSavedCard(index: number){
    this.editorService.loadCard(index)
    this.loadCard()
  }
  deleteCard(index: number){
    this.editorService.deleteCard(index)
    return false
  }

  statsKey(statsName: string, event: any){
    var numberAmount = Number(event.target.value);
    if(isNaN(numberAmount)){
      numberAmount = 0;
    }

    switch(statsName){
      case "pop": this.getCard().unitStats!.pop = numberAmount; break;
      case "cash":  this.getCard().unitStats!.cash = numberAmount; break;
      case "trouble":  this.getCard().unitStats!.trouble = numberAmount; break;
      case "star":  this.getCard().unitStats!.star = numberAmount; break;
    }

    this.editorService.updateCard();
    this.loadCard();
  }

  getAbilitiesLength(): number{
    return this.getCard().abilities.length;
  }

  getHaveStats(): boolean{
    return this.getCard().unitStats != undefined;
  }

  /*haveStatsClick(event:Event){
    var isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      if(this.getCard().unitStats == undefined){
        if(this.lastStats != undefined){
          this.getCard().unitStats = structuredClone(this.lastStats);
        } else {
          this.getCard().unitStats = {attack: 0, defense: 0, damage: 0, health: 0};
        }
      }
    } else {
      if(this.getCard().unitStats != undefined){
        this.lastStats = this.getCard().unitStats;
      }
      this.getCard().unitStats = undefined;
    }
    this.loadCard();
  }*/

  abilityNameInput(index:number, event:any){
    this.getCard().abilities[index].name = event.target.value;
  }

  abilityReminderInput(index:number, event:any){
    this.getCard().abilities[index].reminder = event.target.value;
  }

  abilityOverrideInput(index:number, event:any){
    this.getCard().abilities[index].overrideReminder = event.target.checked;
  }

  addAbility(){
    this.getCard().abilities.push({name:""})
  }

  removeAbility(){
    this.getCard().abilities.pop();
  }  
  
  onFileChanged(event: any) {
    const file = event.target.files[0];
    var fr = new FileReader();
    fr.onload = () => { 
      if(typeof(fr.result) == "string"){
        this.getCard().imageURL = fr.result;
        this.loadCard();
      }
    };
    fr.readAsDataURL(file);
  }

  loadCard(){
    this.nameElement.nativeElement.value = this.getCard().name;
    this.textElement.nativeElement.value = this.getCard().text;
    this.vpElement.nativeElement.value = this.getCard().vp == undefined ? "" : this.getCard().vp;
    this.textSizeElement.nativeElement.value = this.getCard().textSizeModifier;

    // set url
    this.urlElement.nativeElement.value = this.getCard().imageURL;

    // costs
    /*this.costFoodElement.nativeElement.value = this.getCard().cost[CardResource.Food];
    this.costWoodElement.nativeElement.value = this.getCard().cost[CardResource.Wood];
    this.costGemstonesElement.nativeElement.value = this.getCard().cost[CardResource.Gemstones];
    this.costGenericElement.nativeElement.value = this.getCard().cost[CardResource.Generic];*/

   //stats
    this.statsPopElement.nativeElement.value = this.getCard().unitStats?.pop;
    this.statsCashElement.nativeElement.value = this.getCard().unitStats?.cash;
    this.statsTroubleElement.nativeElement.value = this.getCard().unitStats?.trouble;
    this.statsStarElement.nativeElement.value = this.getCard().unitStats?.star;

    // abilities
    for(var i = 0; i < this.abilitiesListElement.nativeElement.children.length; i++){
      var childRow = this.abilitiesListElement.nativeElement.children[i];
      var nameInput = childRow.getElementsByClassName("ability-name")[0];
      var reminderInput = childRow.getElementsByClassName("ability-reminder")[0];
      var overrideInput = childRow.getElementsByClassName("ability-override")[0];

      nameInput.value = this.getCard().abilities[i].name;
      reminderInput.value = this.getCard().abilities[i].reminder == undefined ? "" : this.getCard().abilities[i].reminder;
      overrideInput.checked = this.getCard().abilities[i].overrideReminder;
    }
  }

  ngOnInit(){
    setTimeout(() => {this.loadCard()}, 1)
  }

  constructor(private element:ElementRef, private textService: CardTextService, private editorService: CardEditorService){  }
}
