import Item from "../../types";

const api  =  {
    fetch: async (amount: number = 5) : Promise<Item[]> => {
        const response = await fetch(`https://opentdb.com/api.php?amount=${amount}`);
        const data = await response.json();
        return data.results as Item[];
    }
}

export default api;