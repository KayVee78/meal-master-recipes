import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import * as api from "../api";

interface Props {
  recipeId: string;
  onClose: () => void;
}

export const RecipeModal = ({ recipeId, onClose }: Props) => {
  const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();

  useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const summary = await api.getRecipeSummary(recipeId);
        setRecipeSummary(summary);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRecipeSummary();
  }, [recipeId]);

  if (!recipeSummary) {
    return <></>;
  }
  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{recipeSummary?.title}</h2>
            <span className="close-btn" onClick={onClose}>
              &times;
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipeSummary?.summary }}></p>
        </div>
      </div>
    </>
  );
};
