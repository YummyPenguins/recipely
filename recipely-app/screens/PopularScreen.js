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
  }

  getPopularRecipes = (pageNumber) => {
    function shuffle(array) {
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

    pageNumber = pageNumber || 1;
      fetch(`https://yummypenguin-recipely.herokuapp.com/api/recipes/?&page=${pageNumber}`)
        .then(res => res.json())
        .then(result => {
          var filteredResults = result;
          console.log('saved recipes', this.props.screenProps.recipes)
          // if(this.props.screenProps.recipes.length !== 0) {
          //   filteredResults = this.removeUserSavedRecipeFromSearch(result, this.props.screenProps.recipes);
          // }
          console.log('filtered', filteredResults.recipes.length);
          filteredResults.recipes = shuffle(filteredResults.recipes);
          this.props.screenProps.onPopularRecipesChange(filteredResults.recipes.slice(0, 15));
          // console.log("PROPS", this.props.screenProps.popularRecipes);
        }
      );
  }

  removeUserSavedRecipeFromSearch = (result, savedRecipes) => {
      const userRecipe = savedRecipes;
      // console.log('before', result.recipes.length);
      var newRecipes = result.recipes.filter((recipe) => {
        userRecipe.forEach((currentUserRecipe) => {
          console.log("Check", currentUserRecipe.f2f_id, recipe.recipe_id, currentUserRecipe.f2f_id === recipe.recipe_id)
          if(currentUserRecipe.f2f_id === recipe.recipe_id) {
            return false;
          } else {
            return true;
          }
        })
    
        // for(var i = 0; i < userRecipe.length; i++){
        //   console.log('checker', recipe.recipe_id, userRecipe[i].f2f_id, recipe.recipe_id !== userRecipe[i].f2f_id);
        //   if(userRecipe[i].f2f_id !== recipe.recipe_id) {
        //     return true;
        //   }
        // }
        return false;
        }
      );
     result.recipes = newRecipes;
      // console.log('newRecipes', newRecipes.length);
      // console.log('after', result.recipes.length);
      // console.log('result', result);
      // console.log(result);
      // onSearchChange(query, newResults);
     return result;
  };

  componentDidMount() {
    this.getPopularRecipes();
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
            />
          : <View style={styles.loadingContainer}>
              <Text>Loading recipes</Text>
              <ActivityIndicator size="large" />
            </View>
        }
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
