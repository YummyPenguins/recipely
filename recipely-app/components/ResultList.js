// TODO: RecipeList.js and ResultList.js share a lot of code. Maybe refactor to
// use higher order components.
<<<<<<< HEAD
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
=======
import React from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { Card, SwipeDeck } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../components/CustomButton";

>>>>>>> 1aa14639aee3b6ce9356c20f191ffde80cfb0fb3
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
  onSearchChange
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
    this.handleSaveRecipeButton(recipe);
  };

<<<<<<< HEAD
  onSwipeLeft = (recipe) => {
  
    console.log(recipes.length);
    console.log("Card disliked: " + recipe);
  }
  
  renderNoMoreCards= () => {
    getMoreRecipe(++index);
    //onPopularRecipesChange([]);
    return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <Text>Loading recipes</Text>
        <ActivityIndicator size="large" />
      </View>
    </View>
    
    )
  }

=======
  onSwipeLeft = recipe => {
    console.log("Card disliked: " + recipe);
  };

  renderNoMoreCards = () => {
    return (
      <Card
        featuredTitle="No more cards"
        featuredTitleStyle={{ fontSize: 25 }}
        image={{ uri: "https://i.imgflip.com/1j2oed.jpg" }}
      />
    );
  };
>>>>>>> 1aa14639aee3b6ce9356c20f191ffde80cfb0fb3

  renderCard = recipe => {
    return (
<<<<<<< HEAD
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
=======
      <Card
        key={recipe.recipe_id}
        title={recipe.title}
        image={{ uri: recipe.image_url }}
      >
        <Text style={styles.publisherText}>{recipe.publisher}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Details"
            icon={{ name: "explore" }}
            buttonStyle={{ marginLeft: 0 }}
            onPress={() => this.onLearnMore(recipe)}
          />

          {/*<Button
>>>>>>> 1aa14639aee3b6ce9356c20f191ffde80cfb0fb3
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
<<<<<<< HEAD
      <SwipeDeck
        key={recipes.length}
        data={recipes}
        renderCard={this.renderCard}
        renderNoMoreCards={this.renderNoMoreCards}
        onSwipeRight={this.onSwipeRight}
        onSwipeLeft={this.onSwipeLeft}
      />
=======
    <SwipeDeck
      data={recipes}
      renderCard={this.renderCard}
      renderNoMoreCards={this.renderNoMoreCards}
      onSwipeRight={this.onSwipeRight}
      onSwipeLeft={this.onSwipeLeft}
    />
>>>>>>> 1aa14639aee3b6ce9356c20f191ffde80cfb0fb3
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
<<<<<<< HEAD
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
=======
    flexDirection: "row",
    justifyContent: "space-between"
  },
  publisherText: {
    marginBottom: 10
>>>>>>> 1aa14639aee3b6ce9356c20f191ffde80cfb0fb3
  }
});

export default ResultList;
