import Image from "next/image";
import "../styles/InsightCategory.scss";
import { useState } from "react";
import { CategoryItem, CategoryResponse } from "@/types/Post";

// import icon01 from "@/app/assets/images/contents/post_is_icon-01.png";
// import icon02 from "@/app/assets/images/contents/post_is_icon-02.png";
// import icon03 from "@/app/assets/images/contents/post_is_icon-03.png";

// 임시 데이터 (실제로는 API에서 가져올 데이터)
const mockCategoryData: CategoryResponse = {
  statusCode: "200",
  message: "dev_category_2025. 7. 23.",
  result: [
    {
      "categoryId": 1,
      "order": 1,
      "title": "All",
      "hide": false
    },
    {
      "categoryId": 2,
      "order": 2,
      "title": "사회이슈 🌎",
      "hide": false
    },
    {
      "categoryId": 3,
      "order": 3,
      "title": "절약 📄",
      "hide": false
    },
    {
      "categoryId": 4,
      "order": 4,
      "title": "리본회생 🎁",
      "hide": false
    },
    {
      "categoryId": 5,
      "order": 5,
      "title": "리본회생 🎁",
      "hide": false
    }
  ]
};

export default function InsightCategory() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [categories] = useState<CategoryItem[]>(mockCategoryData.result);

  return (
    <div className="insight-category" data-aos="fade-up">
      {categories
        .filter(category => !category.hide)
        .sort((a, b) => a.order - b.order)
        .map((category) => (
          <button
            key={category.categoryId}
            className={`insight-category-button ${selectedCategoryId === category.categoryId ? 'on' : ''}`}
            onClick={() => setSelectedCategoryId(category.categoryId)}
          >
            <span 
              className="insight-category-button_text"
            >
              {category.title}
            </span>
          </button>
        ))}
    </div>
  );
}