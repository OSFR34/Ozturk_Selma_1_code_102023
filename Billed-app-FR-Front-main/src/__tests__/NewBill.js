/**
 * @jest-environment jsdom
 */
/*------ AJOUT DANS LA LIGNES SUIVANTE-----------*/
// ajout des methodes fireEvent (= utiliser pour simuler des événements DOM)et waitFor (=utiliser pour traiter le code asynchrone)
// import { screen } from "@testing-library/dom"
import {fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
/*------ *AJOUT DES LIGNES SUIVANTES*-----------*/
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router";
// différence userEvent simule des évéments complets (ex: chaine d'évènements) contrairement à fireEvent qui ne traite que d'événement unique.
import userEvent from "@testing-library/user-event";
// Import BillsUI this function create html of Bills page
import BillsUI from "../views/BillsUI.js";
import "@testing-library/jest-dom";
// datas fictives pour test
import { bills } from "../fixtures/bills.js";
// FIN DES IMPORTS RAJOUTES

/*------ AJOUT De LA LIGNE SUIVANTE-----------*/
jest.mock("../app/store", () => mockStore);


describe("Given I am connected as an employee", () => {
  /*---------AJOUT ENVIRONNEMENT (PREPARATION) POUR LA CREATION DE TESTS------------------*/
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
    })
  );
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
  /*---------FIN AJOUT ENVIRONNEMENT (PREPARATION) POUR LA CREATION DE TESTS------------------*/

  // -----------Test 1-----------
  describe("When I am on NewBill Page", () => {
     
     test("Then element with text Envoyer une note de frais is available", async () => {
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByText("Envoyer une note de frais"));
      await waitFor(() => screen.getByTestId("form-new-bill"));
      const textBtn = screen.getByText("Envoyer une note de frais");
      const formNewBill = screen.getByTestId("form-new-bill");
      expect(textBtn).toBeVisible();
      expect(formNewBill).toBeTruthy();
    });
  });
  // -----------Test 2-----------
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.NewBill);

      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      expect(mailIcon).toBeVisible();
    });
  });
  // ----------- Test 3-----------
  describe("when I submit the form with empty fields", () => {
    test("then I should stay on new Bill page", () => {
      window.onNavigate(ROUTES_PATH.NewBill);
      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });
      expect(screen.getByTestId("expense-name").value).toBe("");
      expect(screen.getByTestId("datepicker").value).toBe("");
      expect(screen.getByTestId("amount").value).toBe("");
      expect(screen.getByTestId("vat").value).toBe("");
      expect(screen.getByTestId("pct").value).toBe("");
      expect(screen.getByTestId("file").value).toBe("");
      const form = screen.getByTestId("form-new-bill");    
      const handleSubmitSpy = jest.fn((e) => newBill.handleSubmit(e));      
      form.addEventListener("submit", handleSubmitSpy);     
      fireEvent.submit(form);
      expect(handleSubmitSpy).toHaveBeenCalled();
      expect(form).toBeTruthy();
    });
  });

});