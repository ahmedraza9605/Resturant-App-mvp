export const initialCartState={items:[],promoCode:null,discountPercent:0};

export function cartReducer(state,action){
  switch(action.type){
    case "ADD_ITEM":{
      const existing=state.items.find(i=>i.id===action.item.id);
      const items=existing
        ? state.items.map(i=>i.id===action.item.id?{...i,quantity:i.quantity+1}:i)
        : [...state.items,{...action.item,quantity:1,note:""}];
      return {...state,items};
    }
    case "REMOVE_ITEM":
      return {...state,items:state.items.filter(i=>i.id!==action.id)};
    case "INCREMENT":
      return {...state,items:state.items.map(i=>i.id===action.id?{...i,quantity:i.quantity+1}:i)};
    case "DECREMENT":
      return {...state,items:state.items.flatMap(i=>i.id!==action.id?[i]:i.quantity>1?[{...i,quantity:i.quantity-1}]:[])};
    case "UPDATE_NOTE":
      return {...state,items:state.items.map(i=>i.id===action.id?{...i,note:action.note}:i)};
    case "CLEAR_CART":
      return initialCartState;
    case "APPLY_PROMO":
      return {...state,promoCode:action.code,discountPercent:action.percent};
    case "REMOVE_PROMO":
      return {...state,promoCode:null,discountPercent:0};
    default:return state;
  }
}