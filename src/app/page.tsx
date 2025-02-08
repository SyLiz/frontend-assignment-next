"use client";
import { useState } from "react";
import Button from "../components/Button";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const data = [
  {
    type: "Fruit",
    name: "Apple",
  },
  {
    type: "Vegetable",
    name: "Broccoli",
  },
  {
    type: "Vegetable",
    name: "Mushroom",
  },
  {
    type: "Fruit",
    name: "Banana",
  },
  {
    type: "Vegetable",
    name: "Tomato",
  },
  {
    type: "Fruit",
    name: "Orange",
  },
  {
    type: "Fruit",
    name: "Mango",
  },
  {
    type: "Fruit",
    name: "Pineapple",
  },
  {
    type: "Vegetable",
    name: "Cucumber",
  },
  {
    type: "Fruit",
    name: "Watermelon",
  },
  {
    type: "Vegetable",
    name: "Carrot",
  },
];

enum Type {
  Vegetable = "Vegetable",
  Fruit = "Fruit",
}

interface FoodItem {
  id: number;
  type?: Type;
  name: string;
}

export default function Home() {
  const [foodList, setFoodList] = useState<FoodItem[]>(
    data.flatMap(({ type, name }, i) => {
      return {
        id: i,
        type: Object.values(Type).includes(type as Type)
          ? (type as Type)
          : undefined,
        name: name,
      };
    })
  );
  const [fruitQueue, setFruitQueue] = useState<FoodItem[]>([]);
  const [VegetableQueue, setVegetableQueue] = useState<FoodItem[]>([]);

  const handleRemove = async ({
    item,
    isImmediately = false,
  }: {
    item: FoodItem;
    isImmediately?: boolean;
  }) => {
    try {
      return await delay(isImmediately ? 0 : 5000);
    } finally {
      switch (item.type) {
        case Type.Fruit:
          setFruitQueue((p) => p.filter((e) => e.id !== item.id));
          break;
        case Type.Vegetable:
          setVegetableQueue((p_1) => p_1.filter((e_1) => e_1.id !== item.id));
          break;
      }
    }
  };

  const handleAdd = (item: FoodItem) => {
    switch (item.type) {
      case Type.Fruit:
        setFruitQueue([...fruitQueue, item]);
        break;
      case Type.Vegetable:
        setVegetableQueue([...VegetableQueue, item]);
        break;
    }
    handleRemove({ item }).finally(() => {
      addFoodToOriginal(item);
    });
    setFoodList((p) => p.filter((e) => e.id !== item.id));
  };

  const handleRemoveImmediately = (item: FoodItem) => {
    handleRemove({ item, isImmediately: true });
    addFoodToOriginal(item);
  };

  const addFoodToOriginal = (newItem: FoodItem) => {
    setFoodList((prevList) => {
      const exists = prevList.some((item) => item.id === newItem.id);
      if (!exists) {
        return [...prevList, newItem];
      }
      return prevList;
    });
  };

  return (
    <div className="flex flex-row p-6 space-x-6">
      {/* Left panel */}
      <div className="flex flex-col space-y-3 w-[200px]">
        {foodList.map((e, i) => (
          <Button
            key={i}
            onClick={() => handleAdd(e)}
            className="min-w-48 font-bold"
          >
            {e.name}
          </Button>
        ))}
      </div>
      {/* Fruit */}
      <div className="flex flex-col  space-y-3 items-center h-[720px] w-48 border-gray-200 border-2">
        <div className="w-full text-center font-bold p-2 bg-gray-100">
          Fruit
        </div>
        <div className="flex flex-col w-full px-3 space-y-3">
          {fruitQueue.map((e, i) => (
            <Button
              key={i}
              onClick={() => handleRemoveImmediately(e)}
              className="font-bold"
            >
              {e.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Vegetable */}
      <div className="flex flex-col space-y-3 items-center h-[720px] w-48 border-gray-200 border-2">
        <div className="w-full text-center font-bold p-2 bg-gray-100">
          Vegetable
        </div>
        <div className="flex flex-col w-full px-3 space-y-3">
          {VegetableQueue.map((e, i) => (
            <Button
              key={i}
              onClick={() => handleRemoveImmediately(e)}
              className="font-bold"
            >
              {e.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
