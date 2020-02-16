import React from "react";

import PostItems from "../presentation/PostItems";

export default class PostItemsContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      users: [],
      albums: [],
      postItems: []
    };
  }

  componentDidMount() {
    this.handleRetrieveData();
  }

  handleRetrieveData = () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(posts =>
        this.setState({ posts: posts }, () => {
          fetch("https://jsonplaceholder.typicode.com/users")
            .then(response => response.json())
            .then(users =>
              this.setState({ users: users }, () => {
                fetch("https://jsonplaceholder.typicode.com/albums")
                  .then(response => response.json())
                  .then(albums =>
                    this.setState({ albums: albums }, () => {
                      const items = [];
                      const {
                        state: { posts, users, albums }
                      } = this;

                      for (let i = 0; i < 30; i++) {
                        items.push({
                          id: i,
                          post: posts[i],
                          user: users[i % 10],
                          album: albums[i]
                        });
                      }

                      this.setState({ postItems: items });
                    })
                  );
              })
            );
        })
      );
  };

  handleDeleteRow = deleted => {
    const deletedSet = new Set(deleted);
    fetch(`https://jsonplaceholder.typicode.com/posts/${deleted}`, {
      method: "DELETE"
    });

    this.setState(prevState => {
      return {
        postItems: prevState.postItems.filter(row => !deletedSet.has(row.id))
      };
    });
  };

  handlePostTitleEdit = edited => {
    const rowId = Object.keys(edited)[0];

    const postBody = edited[rowId];

    // call api to update post title
    fetch(
      `https://jsonplaceholder.typicode.com/posts/${
        Object.values(postBody)[0].id
      }`,
      {
        method: "PUT",
        body: JSON.stringify(postBody),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    );

    // update the post title manually in local state to display the changes
    let postItemsCopy = [...this.state.postItems];

    let postItemCopy = { ...postItemsCopy[rowId] };

    postItemCopy.post = Object.values(edited[rowId])[0];

    postItemsCopy[rowId] = postItemCopy;

    this.setState({ postItems: postItemsCopy });
  };

  render() {
    const {
      state: { postItems }
    } = this;

    return (
      <div>
        <br />
        <PostItems
          postItems={postItems}
          deleteRow={this.handleDeleteRow}
          editPostTitle={this.handlePostTitleEdit}
        />
      </div>
    );
  }
}
