import burgerConstructorReducer, {
    addIngredient,
    removeIngredient,
    moveIngredientUp,
    moveIngredientDown,
    clearConstructor
  } from '../burgerConstructorSlice';
  import { TIngredient } from '@utils-types';
  
  const mockBun: TIngredient = {
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
  };
  
  const mockMain: TIngredient = {
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
  };
  
  const mockSauce: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  };
  
  describe('burgerConstructorSlice reducer', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
  
    test('должен вернуть начальное состояние при неизвестном экшене', () => {
      const state = burgerConstructorReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      });
      expect(state).toEqual(initialState);
    });
  
    test('должен положить булку в bun при addIngredient с ингредиентом типа bun', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
  
      expect(state.bun).not.toBeNull();
      expect(state.bun?.name).toBe(mockBun.name);
      expect(state.bun?._id).toBe(mockBun._id);
      expect(typeof state.bun?.id).toBe('string');
      expect(state.bun?.id.length).toBeGreaterThan(0);
      expect(state.ingredients).toHaveLength(0);
    });
  
    test('должен заменить булку при повторном addIngredient с другой булкой', () => {
      const stateWithBun = burgerConstructorReducer(
        initialState,
        addIngredient(mockBun)
      );
  
      const newBun: TIngredient = {
        ...mockBun,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      const state = burgerConstructorReducer(stateWithBun, addIngredient(newBun));
  
      expect(state.bun?._id).toBe('new-bun-id');
    });
  
    test('должен добавить начинку в конец ingredients при addIngredient с ингредиентом не типа bun', () => {
      const state = burgerConstructorReducer(
        initialState,
        addIngredient(mockMain)
      );
  
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(typeof state.ingredients[0].id).toBe('string');
      expect(state.bun).toBeNull();
    });
  
    test('должен удалить ингредиент по id при removeIngredient', () => {
      const stateWithMain = burgerConstructorReducer(
        initialState,
        addIngredient(mockMain)
      );
      const idToRemove = stateWithMain.ingredients[0].id;
  
      const state = burgerConstructorReducer(
        stateWithMain,
        removeIngredient(idToRemove)
      );
  
      expect(state.ingredients).toHaveLength(0);
    });
  
    test('должен переставить ингредиент выше при moveIngredientUp', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockSauce));
  
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(state.ingredients[1]._id).toBe(mockSauce._id);
  
      const movedState = burgerConstructorReducer(state, moveIngredientUp(1));
  
      expect(movedState.ingredients[0]._id).toBe(mockSauce._id);
      expect(movedState.ingredients[1]._id).toBe(mockMain._id);
    });
  
    test('не должен ничего менять при moveIngredientUp с индексом 0', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockSauce));
  
      const movedState = burgerConstructorReducer(state, moveIngredientUp(0));
  
      expect(movedState.ingredients[0]._id).toBe(mockMain._id);
      expect(movedState.ingredients[1]._id).toBe(mockSauce._id);
    });
  
    test('должен переставить ингредиент ниже при moveIngredientDown', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockSauce));
  
      const movedState = burgerConstructorReducer(state, moveIngredientDown(0));
  
      expect(movedState.ingredients[0]._id).toBe(mockSauce._id);
      expect(movedState.ingredients[1]._id).toBe(mockMain._id);
    });
  
    test('не должен ничего менять при moveIngredientDown с последним индексом', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockSauce));
  
      const movedState = burgerConstructorReducer(state, moveIngredientDown(1));
  
      expect(movedState.ingredients[0]._id).toBe(mockMain._id);
      expect(movedState.ingredients[1]._id).toBe(mockSauce._id);
    });
  
    test('должен очистить bun и ingredients при clearConstructor', () => {
      let state = burgerConstructorReducer(initialState, addIngredient(mockBun));
      state = burgerConstructorReducer(state, addIngredient(mockMain));
  
      const clearedState = burgerConstructorReducer(state, clearConstructor());
  
      expect(clearedState).toEqual(initialState);
    });
  });