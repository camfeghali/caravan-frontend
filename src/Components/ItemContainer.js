import React from 'react'
import { Route, Switch } from "react-router-dom";
import Item from './Item'
import Show from './Show'

const ItemContainer = (props) => {

  let items = props.items.map(item => <Item key={item.id} item={item}/>)


  return(
    <div>
      <Switch>
        <Route
          path="/items/:id"
          render={routerProps => {
            let id = parseInt(routerProps.match.params.id)
            // console.log("items are:", props.items)
            let item = props.items.find(
              item => item.id === id
            )
            return <Show item={item} />
          }}
        />
        <Route
          path="/items"
          render={() => {
            return (
              <div>
                {items}
              </div>
            );
          }}
        />
      </Switch>
    </div>
  )
}

export default ItemContainer
