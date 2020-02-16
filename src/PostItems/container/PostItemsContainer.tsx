import React from "react";

import PostItems from "../presentation/PostItems";
import Notifier from '../presentation/Notifier';

interface Props { };

interface State {
  posts?: object[];
  users?: object[];
  albums?: object[];
  postItems?: object[];
  openNotifier?: boolean;
};

export default class PostItemsContainer extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      users: [],
      albums: [],
      postItems: [],
      openNotifier: false
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
                      const items = [] as object[];
                      const {
                        state: { posts, users, albums }
                      } = this;

                      for (let i = 0; i < 30; i++) {
                        items.push({
                          id: i,
                          post: posts && posts[i],
                          user: users && users[i % 10],
                          album: albums && albums[i]
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
    this.setState({ openNotifier: true });

    const deletedSet = new Set(deleted);
    fetch(`https://jsonplaceholder.typicode.com/posts/${deleted}`, {
      method: "DELETE"
    }).then(() =>
      this.setState({ openNotifier: false })
    );

    this.setState(prevState => {
      return {
        postItems: prevState.postItems && prevState.postItems.filter((row: any) => !deletedSet.has(row.id))
      };
    });
  };

  handlePostTitleEdit = edited => {
    this.setState({ openNotifier: true });
    const rowId = Object.keys(edited)[0];

    const postBody: any[] = edited[rowId];
    if (postBody) {
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
      ).then(() => this.setState({ openNotifier: false }));
    }

    let aToObj = Object.assign({}, this.state.postItems);

    let MyObject = {
      aToObj,
      [Symbol.iterator]: function* () {
        let properties = Object.keys(this);
        for (let i of properties) {
          yield [i, this[i]];
        }
      }
    };

    // update the post title manually in local state to display the changes
    // @ts-ignore
    let postItemsCopy = [...this.state.postItems];

    let postCopy = { ...postItemsCopy[rowId] };

    postCopy.post = Object.values(edited[rowId])[0];

    postItemsCopy[rowId] = postCopy;
    // @ts-ignore
    this.setState({ postItems: postItemsCopy });
  }
  render() {
    const {
      state: { postItems, openNotifier }
    } = this;

    if (postItems !== undefined) {
      return (
        <div>
          <PostItems
            postItems={postItems}
            deleteRow={this.handleDeleteRow}
            editPostTitle={this.handlePostTitleEdit}
          />
          {openNotifier === true ? <Notifier /> : null}
        </div>
      );
    }
    else {
      return <div></div>
    }
  }
}
