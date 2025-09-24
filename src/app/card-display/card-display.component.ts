import { Component, ElementRef, HostListener } from '@angular/core';
import { CardData, CardResource } from '../carddata';
import { CardTextService } from '../card-text.service';
import { CardEditorService } from '../card-editor.service';
import { KeyValuePipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-card-display',
  standalone: true,
  imports: [KeyValuePipe, NgForOf],
  templateUrl: './card-display.component.html',
  styleUrls: ['./card-display.component.less']
})
export class CardDisplayComponent {
  // card sizes
  public cardWidth: number = 0;
  public cardHeight: number = 0;
  public innerCardWidth: number = 0;
  public innerCardHeight: number = 0;
  // font sizes
  public fontSizeTiny: number = 0;
  public fontSizeSmall: number = 0;
  public fontSizeMedium: number = 0;
  public fontSizeLarge: number = 0;
  public fontSizeHuge: number = 0;
  // textbox font sizes
  public fontSizeReminder: number = 0;
  // resource icons
  public statIconSize: number = 0;
  public realStatIconSize: number = 0;
  public statModifier: number = 3;
  public resourceIconSize: number = 0;

  getCurrentCard(): CardData{
    return this.editorService.getCurrentCard();
  }

  setCardDimensions(){
    var containerWidth = this.element.nativeElement.offsetWidth;
    var containerHeight = this.element.nativeElement.offsetHeight;

    if(containerHeight < containerWidth * 7/5){
      this.cardHeight = containerHeight - 40;
      this.cardWidth = (this.cardHeight) * 5/7;
    } else {
      this.cardWidth = containerWidth - 40;
      this.cardHeight = this.cardWidth * 7/5;
    }

    var borderDistance = this.cardWidth * .065;
    this.innerCardHeight = this.cardHeight - borderDistance;
    this.innerCardWidth = this.cardWidth - borderDistance * 1.2;

    // set font sizes
    this.fontSizeTiny = this.cardWidth * .04;
    this.fontSizeSmall = this.cardWidth * .05;
    this.fontSizeMedium = this.cardWidth * .055;
    this.fontSizeLarge = this.cardWidth * .11;
    this.fontSizeHuge = this.cardWidth * .2;

    // reminder size change based on amount of text
    // set icon size
    this.statIconSize = this.cardWidth * .075;
    this.realStatIconSize = this.statIconSize * 2.5;
  }

  //////////////
  // getter functions for card properties
  //////////////
  getName(): string{
    return this.getCurrentCard().name;
  }

  getPopBackgroundImage(): string {
    return this.getCurrentCard().unitStats!.pop > 0 ? 'url("./assets/trap1.png")' : 'url("./assets/trap3.png")';
  }
  getCashBackgroundImage(): string {
    return this.getCurrentCard().unitStats!.cash > 0 ? 'url("./assets/trap2.png")' : 'url("./assets/trap3.png")';
  }
  getTroubleBackgroundImage(): string {
    return this.getCurrentCard().unitStats!.trouble < 0 ? 'url("./assets/trap4.png")' : 'url("./assets/trap5.png")';
  }

  getCardBackground(): string{
    if(this.getCurrentCard().unitStats!.star > 0){
      return "url('./assets/eighty5.png')";
    }
    if(this.getCurrentCard().unitStats!.trouble != 0){
      return "url('./assets/eighty3.png')";
    }
    return "url('./assets/eighty.png')"
  }

  getBackgroundImage(): string{
    if(this.getCurrentCard().unitStats!.star > 0){
      return "url('./assets/star_checker.png')";
    }
    if(this.getCurrentCard().unitStats!.trouble != 0){
      return "url('./assets/trouble_checker.png')";
    }
    return "url('./assets/normal_checker.png')"
    /*if(this.getCurrentCard().background != "cash" && this.getCurrentCard().background != "star" && this.getCurrentCard().background != "trouble"){
      return  `url('./assets/normal_checker.png')`;
    }
    return `url('./assets/${this.getCurrentCard().background}_checker.png')`;*/
  }

  getTotalText(): number{
    var amount = 0;
    var abilities = this.getWithReminders();
    for(let index in abilities){
      amount += abilities[index].length;
    }
    amount += this.getCurrentCard().text.length;
    return amount;
  }

  getWithReminders(): {[name: string]: string}{
    var remindedAbilities: {[name: string]: string} = {};//{"Guard": "Death!", "Melee": "Womp!"};
    var abilities = this.getCurrentCard().abilities;
    for(let index in abilities){
      var ability = abilities[index];
      var reminderText = this.textService.getReminderText(ability.name);
      if(ability.reminder != null && ability.reminder != ""){
        reminderText = ability.reminder;
      }

      if(reminderText != "" && !ability.overrideReminder){
        remindedAbilities[abilities[index].name] = reminderText;
      }
    }
    return remindedAbilities;
  }

  getReminderless(): string{
    var baseline = "";
    var abilities = this.getCurrentCard().abilities;
    for(let index in abilities){
      var ability = abilities[index];
      var reminderText = this.textService.getReminderText(ability.name);

      if(((ability.reminder == null || ability.reminder == "") && reminderText == "") || (ability.overrideReminder)){
        baseline += ability.name + ", ";
      }
    }
    return baseline.slice(0, baseline.length - 2);
  }

  getText(): string{
    return this.getCurrentCard().text != null ? this.getCurrentCard().text! : "";
  }

  getVP(): number | null{
    if(this.getCurrentCard().vp == undefined){
      return null;
    }
    return this.getCurrentCard().vp!;
  }

  getPaddingBottom(statName: string): string{
    return (Math.abs(this.getAmount(statName)) != 1 && Math.abs(this.getAmount(statName)) != 6 && Math.abs(this.getAmount(statName)) != 8) ? '30%' : '20%'
  }

  getAmount(statName: string): number{
    switch(statName){
      case "pop": return this.getCurrentCard().unitStats?.pop!; 
      case "cash": return this.getCurrentCard().unitStats?.cash!; 
      case "trouble": return this.getCurrentCard().unitStats?.trouble!; 
      case "star": return this.getCurrentCard().unitStats?.star!; 
    }
    return 0;
  }

  getStat(statName: string): string{
    if(this.getCurrentCard().unitStats == undefined){
      return "";
    }

    var amt: number = 0;
    switch(statName){
      case "pop": amt = this.getCurrentCard().unitStats?.pop!; break;
      case "cash": amt = this.getCurrentCard().unitStats?.cash!; break;
      case "trouble": amt = this.getCurrentCard().unitStats?.trouble!; break;
      case "star": amt = this.getCurrentCard().unitStats?.star!; break;
    }
    
    if(amt > 0){
      return "+" + amt;
    }
    return String(amt);
  }

  getImageURL(): string{
    return this.getCurrentCard().imageURL;
  }

  ngOnInit(){
    this.setCardDimensions();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.setCardDimensions();
  }

  constructor(private element:ElementRef, private textService: CardTextService, private editorService: CardEditorService){
    editorService.cardDisplayComponent = this;
  }
}
