import { Page } from '@playwright/test';

export class Base {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
