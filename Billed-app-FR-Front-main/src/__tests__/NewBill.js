/**
 * @jest-environment jsdom
 */
import "@testing-library/dom"
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
  // -----------Test 4-----------
  // FR :lorsque je télécharge un fichier avec le mauvais format
  describe("when I upload a file with the wrong format", () => {
    // FR : alors je devrais rester sur la nouvelle page Bill
    test("then I should stay on new Bill page", async () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
      // ds document,j'appel la proprité le body, applique la propriété innerHTML (récupère du HTML) ici il récupère celui de la fct route avec son paramètre pathname. 
        document.body.innerHTML = ROUTES({ pathname });
      };
      // newBill est instance de la class NewBill, pour y accéder au sein du test, *1 
      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const file = new File(["hello"], "hello.txt", { type: "document/txt" });
      // stockage en sélectionnant id test "file" qui correspond à l'input pour télécharger la pièce jointe .
      const inputFile = screen.getByTestId("file");
      // ....................= j'appelle fct espionne qui va espionner le handleChangeFile dans la class newBill
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);
      // fireEvent simulateur est utilisé içi à la place de userEvent car il permet de ne se concentrer que sur l'événement "change" (sans se préoccuper des événements juste avant le change)
      // paramètre de change (inputFile qui correspond à mon input qui me permet d'ajouter une pièe-jointe,{j'appelle la propriété files préexistante à l'input de type file, entre crochet, je place le fichier déclaré plus haut (création d'un fichier texte spécialement pour effectuer le test) }
      fireEvent.change(inputFile, { target: { files: [file] } });
      const form = screen.getByTestId("form-new-bill");
      // controle si la fct "handleChangeFile" est bien appelée       
      expect(handleChangeFile).toHaveBeenCalled();
      //je test ds inputFile() = input de téléchargement), j'appelle la propriété files et je récupère la PJ dont l'index 0 et je récupère la propriété type de ma premère PJ.
      //toBe doit être de type txt. 
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

      // Create file document PDF
      const file = new File(["doc"], "doc.pdf", { type: "document/pdf" });
      // Get input to upluoad my file
      const inputFile = screen.getByTestId("file");
      // Create spy function to check handleChangeFile has been called
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      // Add Event change to inputFile
      inputFile.addEventListener("change", handleChangeFile);
      // Simulate user change
      fireEvent.change(inputFile, { target: { files: [file] } });
      // Get my error message
      let errorMessage = screen.getByTestId('error-message');
      expect(errorMessage.textContent).toEqual(
        expect.stringContaining(
          "Merci de choisir un fichier avec l'un de ces formats : jpg , jpeg , png."
        )
      )
    });  
  });
});