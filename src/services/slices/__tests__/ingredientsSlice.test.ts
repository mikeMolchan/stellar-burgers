import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
  }
];

describe('ingredientsSlice reducer', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('должен установить isLoading в true и сбросить error при fetchIngredients.pending', () => {
    const previousState = {
      items: [],
      isLoading: false,
      error: 'предыдущая ошибка'
    };

    const action = fetchIngredients.pending('requestId', undefined);
    const state = ingredientsReducer(previousState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен записать полученные ингредиенты и сбросить isLoading при fetchIngredients.fulfilled', () => {
    const previousState = {
      items: [],
      isLoading: true,
      error: null
    };

    const action = fetchIngredients.fulfilled(
      mockIngredients,
      'requestId',
      undefined
    );
    const state = ingredientsReducer(previousState, action);

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  test('должен записать сообщение об ошибке и сбросить isLoading при fetchIngredients.rejected', () => {
    const previousState = {
      items: [],
      isLoading: true,
      error: null
    };

    const action = fetchIngredients.rejected(
      new Error('Не удалось загрузить ингредиенты'),
      'requestId',
      undefined
    );
    const state = ingredientsReducer(previousState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});