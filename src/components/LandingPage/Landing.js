import React, { Component } from 'react';
import axios from 'axios';

import url from '../../util/url.js'
import SearchBar from '../Search/SearchBar.js';
import Results from '../Results/Results.js';
import './landing.scss';

export default class Landing extends Component {

  constructor(props) {
    super(props)
    this.keyUp = this.keyUp.bind(this);



    this.state = {
      images: [],
      loading: true,
      searchQuery: null,
    }
  }

  // fetch on load
  componentDidMount() {
    fetch(url.unsplashUrl)
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          images: data,
          loading: false
        })
      })
      .catch(error => console.log('Error during fetch!', error))
  }
  
  // input search
  performSearch = (query) => {
		axios
			.get(`https://api.unsplash.com/search/photos/?page=1&per_page=100&query=${query}&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS}`)
			.then(data => {
				this.setState({ 
          images: data.data.results, 
          // searchQuery: true,
          loading: false,
        });
			})
			.catch(err => {
				console.log('Error during fetching!', err);
			});
	};

  componentDidUpdate(prevState) {
    if (this.state.data !== prevState.data) {
      this.performSearch();
    }
  }


  // listener for enter key
  keyUp = (e) => {
    if (e.keyCode === 13) {
      this.performSearch();
    }
  };

  render() {

    return (

      <div className='landing-container' keyUp={(e) => this.keyUp(e)}>
        <SearchBar onSearch={this.performSearch}/>
        {this.state.loading
        ? <h3>Loading...</h3>
        : <Results data={this.state.images} />
        }
      </div>
    )
  }
}

document.addEventListener('scroll', function () {
  let scrollTop = window.pageYOffset;
  let windowHeight = window.innerHeight
  let bodyHeight = document.body.scrollHeight - windowHeight;
  let scrollPercentage = (scrollTop / bodyHeight);

  // if the scroll is more than 90% from the top, load more content.
  if (!this.loading && scrollPercentage > 0.9) {
    this.loading = true;
    // page++;
  }
});
