import { createContext, useState, useEffect, } from "react";

import { db } from "../components/firebase";
import { onValue, ref } from "firebase/database";

// Context to store state and pass it globally
export const Createcart = createContext();

// This component wraps its children with the context provider, making cart-related data and functions available to all nested component

const Statestore = ({ children }) => {
  //// . It checks the browser's localStorage for any existing cart items and parses
  //them into an array. If no items are found, an empty array is used as the default value.


  
  // gems store in local storage
  const [cartItems, setCartItems] = useState(
    localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : []
  );

  // minerals store in local storage
  const [mineralsCartItems, setMineralsCartItems] = useState(
    localStorage.getItem("mineralsCartItems")
      ? JSON.parse(localStorage.getItem("mineralsCartItems"))
      : []
  );

  // specail offer in local storage
  const [offerCartItems, setOfferCartItems] = useState(
    localStorage.getItem("offerCartItems")
      ? JSON.parse(localStorage.getItem("offerCartItems"))
      : []
  );

  // Trending products in local storage

  const [trendingCartItems, setTrendingCartItems] = useState(
    localStorage.getItem("trendingCartItems")
      ? JSON.parse(localStorage.getItem("trendingCartItems"))
      : []
  );

  // data calling from firebase



  const [records, setRecords] = useState([]);

  const [recordtwo, setRecordtwo] = useState([]);

  const [specialOffer, setSpecailoffer] = useState([]);

  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, "gems");

    onValue(dbRef, (snapshot) => {
      let records = [];

      snapshot.forEach((childSnapshot) => {
        let keyname = childSnapshot.key;
        let data = childSnapshot.val();
        records.push({ key: keyname, data: data });
      });
      setRecords(records);
      


     
    });

    const dbRef1 = ref(db, "minerals");
    onValue(dbRef1, (snapshot) => {
      let recordtwo = [];
      snapshot.forEach((childSnapshot) => {
        let keyname = childSnapshot.key;
        let data = childSnapshot.val();
        recordtwo.push({ key: keyname, data: data });
      });
      setRecordtwo(recordtwo);
    });

    const dbrefoffer = ref(db, "specialOffer");
    onValue(dbrefoffer, (snapshot) => {
      let offer = [];
      snapshot.forEach((childSnapshot) => {
        let keyname = childSnapshot.key;
        let data = childSnapshot.val();
        offer.push({ key: keyname, data: data });
      });
      setSpecailoffer(offer);
    });

    const dbreftrend = ref(db, "trendingProducts");
    onValue(dbreftrend, (snapshot) => {
      let trending = [];
      snapshot.forEach((childSnapshot) => {
        let keyname = childSnapshot.key;
        let data = childSnapshot.val();
        trending.push({ key: keyname, data: data });
      });
      setTrending(trending);
      console.log(trending)
    
    });
  }, []);

  // This function, addToCart, is responsible for adding items to the cart. It first checks if the item already exists in the
  // cart. If it does, the item's quantity is increased; otherwise, a new item with a quantity of 1 is added

  // gems add to cart
  const addToCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.key === item.key);

    if (isItemInCart) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  // minerals  add to cart
  const addToMineralsCart = (item) => {
    const isItemInCart = mineralsCartItems.find(
      (cartItem) => cartItem.key === item.key
    );

    if (isItemInCart) {
      setMineralsCartItems(
        mineralsCartItems.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setMineralsCartItems([...mineralsCartItems, { ...item, quantity: 1 }]);
    }
  };

  // Specail offer add to cart
  const addToCardOffer = (item) => {
    const isItemInCart = offerCartItems.find(
      (cartItem) => cartItem.key === item.key
    );

    if (isItemInCart) {
      setOfferCartItems(
        offerCartItems.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setOfferCartItems([...offerCartItems, { ...item, quantity: 1 }]);
    }

    localStorage.setItem("offerCartItems", JSON.stringify(offerCartItems));
  };

  // Trending Product add to cart
  const addToCardTrending = (item) => {
    const isItemInCart = trendingCartItems.find(
      (cartItem) => cartItem.key === item.key
    );

    if (isItemInCart) {
      setTrendingCartItems(
        trendingCartItems.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setTrendingCartItems([...trendingCartItems, { ...item, quantity: 1 }]);
    }
    localStorage.setItem("trendingCartItems", JSON.stringify(trendingCartItems));
  };
  // const addToCardTrending = (item) => {
  //   const isItemInCart = trendingCartItems.find(
  //     (cartItem) => cartItem.key === item.key
  //   );
  
  //   if (isItemInCart) {
  //     setTrendingCartItems(
  //       trendingCartItems.map((cartItem) =>
  //         cartItem.key === item.key
  //           ? { ...cartItem, quantity: cartItem.quantity + 1 }
  //           : cartItem
  //       )
  //     );
  //   } else {
  //     setTrendingCartItems([...trendingCartItems, { ...item, quantity: 1 }]);
  //   }
  
  //   // Update the localStorage item with the updated cart items
  //   localStorage.setItem("trendingCartItems", JSON.stringify(trendingCartItems));
  // };
  
  
  // handles removing items from the cart. It checks if the item's quantity is 1;
  // if so, the item is completely removed from the cart. Otherwise, the item's quantity is decreased.

  // gems remove from cart
  const removeFromCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.key === item.key);

    if (isItemInCart.quantity === 1) {
      setCartItems(cartItems.filter((cartItem) => cartItem.key !== item.key));
    } else {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  // minerals remove from cart
  const removemineralFromCart = (item) => {
    const isItemInCart = mineralsCartItems.find(
      (cartItem) => cartItem.key === item.key
    );

    if (isItemInCart.quantity === 1) {
      setMineralsCartItems(
        mineralsCartItems.filter((cartItem) => cartItem.key !== item.key)
      );
    } else {
      setMineralsCartItems(
        mineralsCartItems.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  //  Specail offer remove from cart
  const removeofferFromCart = (item) => {
    const isItemInCart = offerCartItems.find(
      (cartItem) => cartItem.key === item.key
    );

    if (isItemInCart.quantity === 1) {
      setOfferCartItems(
        offerCartItems.filter((cartItem) => cartItem.key !== item.key)
      );
    } else {
      setOfferCartItems(
        offerCartItems.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity - 1
              
            }
            : cartItem
        )
      );
    }
  };

  // Trending producct remove from card

  const removeTrendingFromCart = (item) => {
    const isItemInCart = trendingCartItems.find(
      (cartItem) => cartItem.key === item.key
    );

    if (isItemInCart.quantity === 1) {
      setTrendingCartItems(
        trendingCartItems.filter((cartItem) => cartItem.key !== item.key)
      );
    } else {
      setTrendingCartItems(
        trendingCartItems.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  // simply empties the cart by setting the cartItems state to an empty array.

  // gems cart clear
  const clearCart = () => {
    setCartItems([]);
  };

  // minerals cart clear
  const clearCartmineral = () => {
    setMineralsCartItems([]);
  };

  // specail offer clear cart
  const clearCartoffer = () => {
    setOfferCartItems([]);
  };

  // Trending product clear cart
  const clearCartTrending = () => {
    setTrendingCartItems([]);
  };

  // calculates the total cost of the items in the cart by iterating through each item and multiplying its price by its quantity.

  // gem total cart
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.data.gemPrice * item.quantity,
      0
    );
  };

  // minerals total  in cart
  const getCartTotalmineral = () => {
    return mineralsCartItems.reduce(
      (total, item) => total + item.data.mineralPrice * item.quantity,
      0
    );
  };

  // offer totol in cart

  const getCartTotaloffer = () => {
    return offerCartItems.reduce(
      (total, item) => total + item.data.offerPrice * item.quantity,
      0
    );
  };
  console.log(getCartTotaloffer())

  //Trending total in cart
  // const getCartTotalTrending = () => {
  //   return trendingCartItems.reduce(
  //     (total, item) => total + item.data.TrendingPrice * item.quantity,
  //     0
  //   );
  // };
  const getCartTotalTrending = () => {
    return trendingCartItems.reduce(
      (total, item) => total + item.data.trendingPrice * item.quantity,
      0
    );
  };
  

  

  // This useEffect runs when the component mounts.
  // It retrieves cart data from localStorage and updates the cartItems state with the parsed data.

  useEffect(() => {
    const data = localStorage.getItem("cartItems");
    if (data) {
      setCartItems(JSON.parse(data));
    }

    // minerals local storege
    const mineralsData = localStorage.getItem("mineralsCartItems");
    if (mineralsData) {
      setMineralsCartItems(JSON.parse(mineralsData));
    }

    // special offer

    const offerData = localStorage.getItem("offerCartItems");
    if (offerData) {
      setOfferCartItems(JSON.parse(offerData));
    }

    // trending
    const trendingData = localStorage.getItem("trendingCartItems");
    if (trendingData) {
      setTrendingCartItems(JSON.parse(trendingData));
    }
  }, []);

  // This useEffect runs whenever the cartItems state changes.
  //  It updates the localStorage with the current state of the cart, converting the array to a JSON string
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);




  return (
    <Createcart.Provider
      value={{
        // gems functions and node data //
        records,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,

        // minerals functions and node data //
        recordtwo,
        mineralsCartItems,
        addToMineralsCart,
        removemineralFromCart,
        clearCartmineral,
        getCartTotalmineral,

        // special offer functions and node data
        specialOffer,
        offerCartItems,
        addToCardOffer,
        removeofferFromCart,
        clearCartoffer,
        getCartTotaloffer,

        // Trending offer functions and nodes data
        trending,
        trendingCartItems,
        addToCardTrending,
        removeTrendingFromCart,
        clearCartTrending,
        getCartTotalTrending,
      }}
    >
      {children}
 
    </Createcart.Provider>
  );
};
export default Statestore;
