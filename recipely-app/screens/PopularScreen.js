import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SwipeDeck } from 'react-native-elements';
import ResultList from '../components/ResultList';

class PopularScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showYummy: false,
      showTrash: false
    }
    this.handleYummy = this.handleYummy.bind(this);
    this.handleTrash = this.handleTrash.bind(this);
  }

  getPopularRecipes = (pageNumber) => {
    // clearTimeout(this.showTimer);
    //this.setState({showYummy: false, showTrash: false});
    pageNumber = pageNumber || 1;
      fetch(`https://yummypenguin-recipely.herokuapp.com/api/recipes/?&page=${pageNumber}`)
        .then(res => res.json())
        .then(result => {
          if(result) {
            var filteredResults = this.removeUserSavedRecipeFromSearch(result, this.props.screenProps.recipes);
            this.props.screenProps.onPopularRecipesChange(filteredResults.recipes);
          }
        }
      );
  }

  removeUserSavedRecipeFromSearch = (result, savedRecipes) => {
    const userRecipe = savedRecipes;
    var newRecipes = result.recipes.filter((recipe) => {
      for(var i = 0; i < userRecipe.length; i++){
        console.log('checker', recipe.recipe_id, userRecipe[i].f2f_id, recipe.recipe_id === userRecipe[i].f2f_id);
        if(userRecipe[i].f2f_id === recipe.recipe_id) {
          return false;
        }
      }
      return true;
    });
    
    result.recipes = newRecipes.map((recipe, index) => {
      recipe.id = index;
      return recipe;
    });

    result.recipes = this.shuffle(result.recipes);
    result.recipes = result.recipes.slice(0, 15);
    return result;
  };

  handleYummy = () => {
    clearTimeout(this.showTimer);
    this.setState({showYummy: true, showTrash: false});
    this.showTimer = setTimeout(() => {
      this.setState({showYummy: false, showTrash: false});
    }, 600);
  }
  
  handleTrash = () => {
    clearTimeout(this.showTimer);
    this.setState({showYummy: false, showTrash: true});
    this.showTimer = setTimeout(() => {
      this.setState({showYummy: false, showTrash: false});
    }, 600);
  }

  shuffle = (array) => {
      var currentIndex = array.length, temporaryValue, randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
  }

  componentDidMount() {
    this.getPopularRecipes();
  }

  componentWillUnmount() {
    clearTimeout(this.showTimer);
  }

  render() {
    const {
      idToken,
      popularRecipes,
      recipes: savedRecipes,
      onRecipesChange,
      onPopularRecipesChange,
    } = this.props.screenProps;
    const { navigation } = this.props;
    console.log(   JSON.stringify(this.state))

    return (
      <View style={styles.container}>
        { popularRecipes 
          ? <ResultList
              navigation={navigation}
              recipes={popularRecipes}
              savedRecipes={savedRecipes}
              idToken={idToken}
              getMoreRecipe={this.getPopularRecipes.bind(this)}
              onPopularRecipesChange={onPopularRecipesChange}
              onRecipesChange={onRecipesChange}
              onSearchChange={(query, result) => onPopularRecipesChange(result)}
              onYummy={this.handleYummy}
              onTrash={this.handleTrash}
            />
          : <View style={styles.loadingContainer}>
              <Text>Loading recipes</Text>
              <ActivityIndicator size="large" />
            </View>
        }
        {this.state.showYummy && <Text>Yummy!</Text>}
        {this.state.showTrash && <Text>Eww!</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PopularScreen;
