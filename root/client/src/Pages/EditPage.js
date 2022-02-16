import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CreatedImage from "../components/CreatePage/CreatedImage";
import IngredientSelection from "../components/CreatePage/IngredientSelection";
import AvailableIngredients from "../components/CreatePage/AvailableIngredients";

const EditPage = ({ currentUsername, setNoSessionFound }) => {
  // Create states
  const [ingredientsList, setIngredientsList] = useState({});
  const [category, setCategory] = useState("Bases");
  const [chosenIngredients, setChosenIngredients] = useState({
    Bases: null,
    Flavourings: null,
    Toppings: [],
  });
  const [currentSelection, setCurrentSelection] = useState({});

  // Use params
  const { id } = useParams();

  // Make API calls
  useEffect(async () => {
    await axios
      .all([
        axios.get("/api/ingredients/base"),
        axios.get("/api/ingredients/flavours"),
        axios.get("/api/ingredients/toppings"),
        axios.get(`/api/teacardsinfo/show/${id}`),
      ])
      .then(
        ([
          { data: baseData },
          { data: flavouringData },
          { data: toppingsData },
          { data: selectionData },
        ]) => {
          const fetched = {
            Bases: baseData.data,
            Flavourings: flavouringData.data,
            Toppings: toppingsData.data,
          };
          setIngredientsList({ ...ingredientsList, ...fetched });
          setCurrentSelection(selectionData.data);
        }
      );
  }, [id, currentUsername]);
  console.log(currentSelection);
  useEffect(() => {
    //triggers only once
    const initial = {
      Bases: {name: currentSelection?.base?.name, id: currentSelection?.base?._id },
      Flavourings: {name: currentSelection?.flavour?.name, id: currentSelection?.flavour?._id },
      Toppings: currentSelection?.toppings?.map((e)=> {
        return {name: e.name, id: e._id}
      })
    };
    setChosenIngredients({ ...chosenIngredients, ...initial });
  }, [currentSelection]);

  return (
    <div className="flex bg-lighterpink font-normal">
      <CreatedImage />
      <div className="container w-3/4 h-screen flex">
        <IngredientSelection
          category={category}
          setCategory={setCategory}
          chosenIngredients={chosenIngredients}
          username={currentUsername}
          setNoSessionFound={setNoSessionFound}
          currentSelection={currentSelection}
        />
        <AvailableIngredients
          ingredientsList={ingredientsList}
          chosenIngredients={chosenIngredients}
          setChosenIngredients={setChosenIngredients}
          category={category}
        />
      </div>
    </div>
  );
};

export default EditPage;
