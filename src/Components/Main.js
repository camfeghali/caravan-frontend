import React from 'react'
import Header from './Header'
import SellForm from './SellForm'
import ItemContainer from './ItemContainer'
import { withRouter } from 'react-router-dom'

class Main extends React.Component{

  state={
    items: [],
    categories: [],
    searchTerm: "",
    selection: "",
    sellForm: false
  }

  // ================= Fetch Data =====================
  componentDidMount(){
    console.log("Main did mount")
    this.setState({user: this.props.user})
    this.fetchItems()
    this.fetchCategories()
  }

  // ----------------- Fetch Items ---------------------
  fetchItems = () => {
    fetch('http://localhost:3000/items')
    .then(res => res.json())
    .then(items => {
      this.setState({items: items})})
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

  createSubmitHandler = (item, user) => {
    let url = "http://localhost:3000/items"
    let config = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({user: user, item: item}),
    }
    fetch(url, config)
    .then(res => res.json())
    .then(item => {
      this.addItemToState(item)})

  }

  addItemToState = (item) => {
    let newArray = [item, ...this.state.items]
    this.setState({items: newArray})
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

  // ------------- Toggle Sell Form --------------

  toggleForm = () => {
    this.setState({sellForm: !this.state.sellForm})
  }

  render(){
    let items = this.filterHandler()
    let categories = this.state.categories
    return(
      <div>
        <Header logOutHandler={this.props.logOutHandler} user={this.props.user} toggleFormHandler = {this.toggleForm} categories={categories} createSubmitHandler={this.createSubmitHandler} title="Caravan" logo="truck" color="primary" selectHandler={this.selectHandler} submitHandler={this.submitHandler}/>
        {this.state.sellForm ? <SellForm user={this.props.user} categories={categories} createSubmitHandler={this.createSubmitHandler}/> : null}
        <ItemContainer items={items}/>
      </div>
    )
  }
}

export default withRouter(Main)
