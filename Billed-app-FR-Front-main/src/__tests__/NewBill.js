/**
 * @jest-environment jsdom
 */
import "@testing-library/dom"
/*------ AJOUT DANS LA LIGNES SUIVANTE-----------*/

// import { screen } from "@testing-library/dom"
import {fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
/*------ *AJOUT DES LIGNES SUIVANTES*-----------*/
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router";

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
  // -----------Test 4-----------
  describe("when I load a file with the wrong format", () => {
    test("then I should stay on new Bill page", async () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const file = new File(["format not accepted"], "format not accepted.txt", { type: "document/txt" });
      const inputFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);
    
      fireEvent.change(inputFile, { target: { files: [file] } });
      const form = screen.getByTestId("form-new-bill");
      expect(handleChangeFile).toHaveBeenCalled();
      
      expect(inputFile.files[0].type).toBe("document/txt");      
      expect(form).toBeTruthy();
    });
    test("Then the error message should be displayed", () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const file = new File(["invalid format"], "invalid format.pdf", { type: "document/pdf" });
      const inputFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);
     
      fireEvent.change(inputFile, { target: { files: [file] } });
     
      let errorMessage = screen.getByTestId('error-message');
      expect(errorMessage.textContent).toEqual(
      expect.stringContaining("Merci de choisir un fichier avec l'un de ces formats : jpg , jpeg , png.")
      )
    });  
  });
});