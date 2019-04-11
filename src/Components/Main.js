import React from 'react'
import Filter from './Filter'
import Form from './Form'
import ItemContainer from './ItemContainer'

class Main extends React.Component{

  state={
    items: [],
    categories: [],
    searchTerm: "",
    selection: ""
  }

  // ================= Fetch Data =====================
  componentDidMount(){
    this.fetchItems()
    this.fetchCategories()
  }

  // ----------------- Fetch Items ---------------------
  fetchItems = () => {
    fetch('http://localhost:3000/items')
    .then(res => res.json())
    .then(items => this.setState({items: items}))
  }

  // ---------------- Fetch Categories ---------------------
  fetchCategories = () => {
    fetch('http://localhost:3000/categories')
    .then(res => res.json())
    .then(categories => this.setState({categories: categories}))
  }

  //==================== Event Handlers ======================
  submitHandler = (searchTerm) => {
    this.setState({searchTerm: searchTerm})
  }

  selectHandler = (selection) => {
    this.setState({selection: selection})
  }

 // --------------- Master Filter Handler ------------------
  filterHandler = () =>{
    if(this.state.searchTerm && this.state.selection){
      let searchResults = this.nameSearchFilter(this.state.searchTerm)
      return this.doubleSearchFilter(searchResults, this.state.selection)
    }else if(this.state.selection){
      return this.categorySelectionFilter(this.state.selection)
    }else if (this.state.searchTerm){
      return this.nameSearchFilter(this.state.searchTerm)
    }else{
      return this.state.items
    }
  }
  // ----------------- Handle Search Only ----------------
  nameSearchFilter = (input) => {
    return this.state.items.filter(item => {
      return item.name.toLowerCase().includes(input.toLowerCase())
    })
  }

  // ------- Handle Selection Only -----
  categorySelectionFilter = (input) => {
    console.log("input is: ", input)
    if(input.toLowerCase() !== "all"){
      return this.state.items.filter(item => {
        return item.category.toLowerCase().includes(input.toLowerCase())
      })
    }else{
      return this.state.items
    }

  }
  // -------- Helper Function to handle Both Selection and Search Filters ---------
  doubleSearchFilter = (arrayOfItems, selection) =>{
    return arrayOfItems.filter(item => {
      return item.category.toLowerCase().includes(selection.toLowerCase())
    })
  }



  render(){
    let items = this.filterHandler()
    let categories = this.state.categories
    return(
      <div>
        <Filter categories={categories} selectHandler={this.selectHandler} submitHandler={this.submitHandler}/>
        <Form />
        <ItemContainer items={items}/>
      </div>
    )
  }

}

export default Main
