import Expo from 'expo';
import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, ActivityIndicator, View, Text, Button } from 'react-native';
import StartupStack from './navigation/routes';
import jwtDecode from 'jwt-decode';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAppReady: false,
      isLoggedIn: false,
      idToken: null,
      user: { username: null, userId: null },
      recipes: [],
      image: null,
      predictions: [],
      searchResults: {},
      ingredients: [
        {name: 'blueberry'},
        {name: 'strawberry'},
        {name: 'blackberry'}
      ],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('id_token', (error, idToken) => {
      // Check if the user is still logged in
      if (idToken !== null) {
        this.setState({isLoggedIn: true});
        this.setIdToken(idToken);
        // Fetch user's recipes
        fetch('https://jellyfiish-recipely.herokuapp.com/api/recipes?q=')
          .then(res => res.json())
          .then(results => this.onRecipesChange(results.recipes))
          .then(() => {
            this.setState({isAppReady: true})
          });
      } else {
        this.setState({isAppReady: true});
      }
    });
  }

  setIdToken = (idToken) => {
    if (idToken === null) {
      this.setState({
        idToken: null,
        user: { username: null, userId: null }
      });
    } else {
      // Set token and user information
      const decoded = jwtDecode(idToken);
      this.setState({
        idToken,
        user: {
          username: decoded.user,
          userId: decoded.sub
        }
      });
    }
  };

  onRecipesChange = (recipes) => {
    this.setState({recipes});
  };

  onImageChange = (image) => {
    this.setState({image});
  }

  onPredictionsChange = (predictions) => {
    this.setState({predictions});
  }

  onSearchChange = (query, results) => {
    this.setState({
      searchResults: { ...this.state.searchResults, [query]: results }
    });
  };

  onIngredientChange = (ingredients) => {
    this.setState({ingredients});
  };

  onLoginChange = () => {
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  render() {
    return (
      <StartupStack
        screenProps={
          {
            isAppReady: this.state.isAppReady,
            isLoggedIn: this.state.isLoggedIn,
            user: this.state.user,
            recipes: this.state.recipes,
            image: this.state.image,
            predictions: this.state.predictions,
            searchResults: this.state.searchResults,
            ingredients: this.state.ingredients,
            setIdToken: this.setIdToken,
            onRecipesChange: this.onRecipesChange,
            onImageChange: this.onImageChange,
            onPredictionsChange: this.onPredictionsChange,
            onSearchChange: this.onSearchChange,
            onIngredientChange: this.onIngredientChange,
            onLoginChange: this.onLoginChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
