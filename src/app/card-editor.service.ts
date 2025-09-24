import { Injectable } from '@angular/core';
import { CardDisplayComponent } from './card-display/card-display.component';
import { CardData, CardResource } from './carddata';

function compare( a: CardData, b: CardData ) {
  if(a.unitStats!.star < b.unitStats!.star){
    return -1;
  }
  if(a.unitStats!.star > b.unitStats!.star){
    return 1;
  }
  if ( a.vp! < b.vp! ){
    return -1;
  }
  if ( a.vp! > b.vp! ){
    return 1;
  }
  return 0;
}

@Injectable({
  providedIn: 'root'
})
export class CardEditorService {
  allCards: Array<CardData> = [];

  currentCard: CardData = {
    unitStats: {pop: 0, cash: 0, trouble: 0, star: 0},
    vp: 0,
    abilities: [],
    text: "",
    background: "",
    name: "",
    imageURL: "",
    textSizeModifier: 1
  };
  
  cardDisplayComponent?: CardDisplayComponent;

  saveCard() {
    var index = this.allCards.findIndex(card => card.name == this.currentCard.name);
    if(index == -1){
      this.allCards.push(this.currentCard)
    } else {
      this.allCards[index] = this.currentCard;
    }
    this.currentCard = structuredClone(this.currentCard);

    this.allCards.sort(compare);

    localStorage.setItem("savedCards", JSON.stringify(this.allCards))
  }

  loadCard(index: number) {
    this.currentCard = structuredClone(this.allCards[index])
  }

  deleteCard(index: number) {
    this.allCards.splice(index, 1)

    localStorage.setItem("savedCards", JSON.stringify(this.allCards))
  }

  getCurrentCard(): CardData{
    return this.currentCard;
  }

  updateCard(){
    if(this.cardDisplayComponent != undefined){
      this.cardDisplayComponent.setCardDimensions();
    }
  }

  constructor() {
    if(localStorage.getItem("savedCards") != null){
      this.allCards = JSON.parse(localStorage.getItem("savedCards")!)
      if(this.allCards.length > 0){
        this.loadCard(0)
      }
    }
  }
}
