import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients';
import { getConstructorItems } from '../../services/slices/burgerConstructor';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(getIngredients);
  const { bun, ingredients: constructorIngredients } =
    useSelector(getConstructorItems);

  // Подсчитываем количество каждого ингредиента в конструкторе
  const ingredientCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};

    // Считаем булку
    if (bun) {
      counts[bun._id] = 2; // булка используется дважды
    }

    // Считаем остальные ингредиенты
    constructorIngredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] || 0) + 1;
    });

    return counts;
  }, [bun, constructorIngredients]);

  // Добавляем счетчики к ингредиентам
  const bunsWithCount = useMemo(
    () =>
      ingredients
        .filter((ingredient) => ingredient.type === 'bun')
        .map((ingredient) => ({
          ...ingredient,
          count: ingredientCounts[ingredient._id] || 0
        })),
    [ingredients, ingredientCounts]
  );

  const mainsWithCount = useMemo(
    () =>
      ingredients
        .filter((ingredient) => ingredient.type === 'main')
        .map((ingredient) => ({
          ...ingredient,
          count: ingredientCounts[ingredient._id] || 0
        })),
    [ingredients, ingredientCounts]
  );

  const saucesWithCount = useMemo(
    () =>
      ingredients
        .filter((ingredient) => ingredient.type === 'sauce')
        .map((ingredient) => ({
          ...ingredient,
          count: ingredientCounts[ingredient._id] || 0
        })),
    [ingredients, ingredientCounts]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={bunsWithCount}
      mains={mainsWithCount}
      sauces={saucesWithCount}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
