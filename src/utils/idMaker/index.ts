function* idMaker() {
  let index = 0;
  while (true) {
    yield index++;
  }
}

export const idGen = idMaker();
