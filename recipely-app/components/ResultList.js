// TODO: RecipeList.js and ResultList.js share a lot of code. Maybe refactor to
// use higher order components.
import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  View,
} from 'react-native';
import { 
  Card, 
  SwipeDeck 
} from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/CustomButton';
var index = 1

// Navigation prop needs to be passed down because it does not get passed down
// child components.
const ResultList = ({
  navigation,
  recipes,
  savedRecipes,
  idToken,
  query,
  onPopularRecipesChange,
  getMoreRecipe,
  onRecipesChange,
  onSearchChange,
  onYummy,
  onTrash
}) => {
  onLearnMore = recipe => {
    // When user presses on "Details" button, navigate them to a detail screen.
    // Pass down props that can be acessed using this.props.navigation.state.params
    navigation.navigate("SearchDetail", { ...recipe });
  };

  handleSaveRecipeButton = async recipe => {
    const id = recipe.recipe_id;
    const isSaved = savedRecipes.find(recipe => recipe.f2f_id === id);
    // Only add recipe if it has not been saved yet
    if (!isSaved) {
      // Remove recipe from search so user knows it was saved
      // removeRecipeFromSearch(recipe);
      // Making get request to get details of recipe so that it can be added to database
      let recipeObj = await fetch(
        `https://yummypenguin-recipely.herokuapp.com/api/recipes/${id}`
      )
        .then(res => res.json())
        .then(result => result.recipe);
      recipeObj = {
        ...recipeObj,
        f2f_id: recipe.recipe_id,
        thumbnail_url: recipe.image_url
      };
      // Update client's list of recipes. We wait until we get the ingredients to add it.
      onRecipesChange([...savedRecipes, recipeObj]);
      // Make the post request to add recipe to database
      fetch("https://yummypenguin-recipely.herokuapp.com/api/users/recipes/", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `Bearer ${idToken}`
        },
        method: "POST",
        body: JSON.stringify(recipeObj)
      });
    }
  };

  // removeRecipeFromSearch = (recipe) => {
  //   const newResults = recipes.filter(otherRecipe => otherRecipe.recipe_id !== recipe.recipe_id);
  //   onSearchChange(query, newResults);
  // };

  onSwipeRight = recipe => {
    // console.log("Card liked: " + JSON.stringify(recipe));
    onYummy();
    this.handleSaveRecipeButton(recipe);
  };

  onSwipeLeft = (recipe) => {
    onTrash();
    console.log(recipes.length);
    console.log("Card disliked: " + recipe);
  }
  
  renderNoMoreCards= () => {
    console.log('no more cards')
    getMoreRecipe(++index);
    //onPopularRecipesChange([]);
    return (
    // <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <Text>Loading recipes</Text>
        <ActivityIndicator size="large" />
      </View>
    // </View>
    )
  }

  renderCard = recipe => {
    return (
        <Card
          key={recipe.recipe_id}
          title={recipe.title}
          image={{ uri: recipe.image_url }}
        >
          <Text style={styles.publisherText}>{recipe.publisher}</Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.leftSwipe}>{'SWIPE TO\n<<<TRASH'}</Text>
            <Button
              title='Details'
              icon={{name: 'explore'}}
              buttonStyle={{marginRight: 0}}
              onPress={() => this.onLearnMore(recipe)}
            />
            <Text>{'SWIPE TO\nSTASH>>>'}</Text>
            {/*<Button
              title='Add'
              icon={{name: 'add'}}
              buttonStyle={{marginRight: 0}}
              onPress={() => this.handleSaveRecipeButton(recipe)}
            />*/}
        </View>
      </Card>
    );
  };

  return (
      <SwipeDeck
        key={recipes.length}
        data={recipes}
        renderCard={this.renderCard}
        renderNoMoreCards={this.renderNoMoreCards}
        onSwipeRight={this.onSwipeRight}
        onSwipeLeft={this.onSwipeLeft}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 160
  },
  publisherText: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  leftSwipe: {
    textAlign: 'right'
  }
});

export default ResultList;
