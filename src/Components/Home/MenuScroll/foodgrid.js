import React from "react";
import Carousel from "react-grid-carousel";
import styled from "styled-components";
import { foods } from "Data/fooddata";
import { navBlack, pizzaRed } from "Styles/colors";

const ArrowBtn = styled.span`
  display: inline-block;
  position: absolute;
  top: 33%;
  right: ${({ type }) => (type === "right" ? "-40px" : "unset")};
  left: ${({ type }) => (type === "left" ? "-40px" : "unset")};
  width: 45px;
  height: 45px;
  background: ${pizzaRed};
  border-radius: 50%;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: ${({ type }) =>
      type === "right"
        ? "translate(-75%, -50%) rotate(45deg)"
        : "translate(-25%, -50%) rotate(-135deg)"};
    width: 10px;
    height: 10px;
    border-top: 2px solid #fff;
    border-right: 2px solid #fff;
  }
  &:hover::after {
    border-color: ${navBlack};
  }
`;

const Img = styled.img`
  width: 100%;
  src: ${({ src }) => `${src}`};
  border-radius: 5%;
  border: 1px solid ${navBlack};
  cursor: pointer;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s;
  &:hover {
    -webkit-transform: rotate(25deg);
    -ms-transform: rotate(25deg);
    transform: rotate(25deg);
  }
`;

const FoodGrid = () => {
  return (
    <Carousel
      cols={4}
      rows={1}
      gap={20}
      arrowRight={<ArrowBtn type="right" />}
      arrowLeft={<ArrowBtn type="left" />}
    >
      {foods.map((food, i) => (
        <Carousel.Item key={i}>
          <Img src={food.image} />
          <h5 className="text-white text-center mt-2">{food.name}</h5>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default FoodGrid;
