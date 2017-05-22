import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from 'react-native';
import SearchList from '../components/SearchList';

var index = 1;
class SearchResultScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getSearchRecipe();
  }

  getSearchRecipe = () => {
    //retrieve searchResults and onSearchchange from main.js
    const { searchResults, onSearchChange } = this.props.screenProps;
    //retrieve the query from navigation
    const { query } = this.props.navigation.state.params;
    if (!searchResults.hasOwnProperty(query)) {
      fetch(`https://yummypenguin-recipely.herokuapp.com/api/recipes?q=${query}&page=${index}`)
        .then(res => res.json())
        .then(results => onSearchChange(query, results.recipes.slice(0, 20)));
    }
  }
  render() {
    const {
      searchResults,
      idToken,
      onRecipesChange,
      recipes: savedRecipes,
      onSearchChange
    } = this.props.screenProps;
    const { query } = this.props.navigation.state.params;
    const { navigation } = this.props;

    let recipes = [];
    if (searchResults.hasOwnProperty(query)) {
      recipes = searchResults[query];
    }

    return (
      <View style={styles.container}>
        { recipes.length !== 0
          ? <SearchList
              navigation={navigation}
              recipes={recipes}
              savedRecipes={savedRecipes}
              idToken={idToken}
              query={query}
              onRecipesChange={onRecipesChange}
              onSearchChange={onSearchChange}
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

export default SearchResultScreen;
