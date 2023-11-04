/**
 * @jest-environment jsdom
 */


/*-------AJOUT DE LA LIGNE SUIVANTE------*/
import "@testing-library/jest-dom";
// import requête de testing-library/dom (screen permet de sélectionner des éléments qu'on un attribut spécifique)
import { screen, waitFor } from "@testing-library/dom";
/*-------AJOUT DE LA LIGNE SUIVANTE------*/
// La "@testing-library/user-event"bibliothèque est une extension de "@testing-library"qui fournit des outils pour simuler les interactions des utilisateurs avec le DOM.
import userEvent from "@testing-library/user-event";
/*-------AJOUT DE LA LIGNE SUIVANTE------*/
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
/*-------AJOUT DE LA LIGNE SUIVANTE------*/
// fichier avec toutes les bills fictives
import mockStore from "../__mocks__/store";
/*-------AJOUT DE LA LIGNE SUIVANTE------*/
import { ROUTES } from "../constants/routes.js";
import router from "../app/Router.js";

/*-------AJOUT DE LA LIGNE SUIVANTE------*/
// permet de savoir si il y aune erreur ds la page.

jest.mock("../app/store", () => mockStore);


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      // ***------ADD NEXT LINE------***/
      // teste si la classe “active-icon” fait partie des classes de l’élément windowIcon.
      expect(windowIcon.getAttribute("class")).toContain("active-icon");

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

 ///*****************ADDING NEW TESTS************************///
    ///--------------- TEST n° 1 ------------------///

    describe("When I click on the new bill button", () => { 
      test("opening the new bill form", () => {
        const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
        };
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
        
        const billS = new Bills({
        document, 
        onNavigate, 
        store: mockStore, 
        bills: bills, 
        localStorage: window.localStorage
        });
        document.body.innerHTML = BillsUI({data : bills}); 
        const MockHandleClickNewBill = jest.fn((e) => billS.handleClickNewBill(e)); 
        const newBillBtn = screen.getByText('Nouvelle note de frais'); 
        newBillBtn.addEventListener("click", MockHandleClickNewBill); 
        newBillBtn.click();
        expect(MockHandleClickNewBill).toHaveBeenCalled();
        const newBillPageHeader = screen.queryByText("Envoyer une note de frais");
        expect(newBillPageHeader).toBeTruthy();
        document.body.innerHTML = "";
        });
      })



       ///------------ TEST n° 2 ----------------///

    describe('When I click on the eye icon to display the bill', () => { 
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
      });
      test('A modal should open', async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
       
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
        }
       
        const billS = new Bills({
          document,
          onNavigate,
          store: null,
          bills: bills,
          localStorage: window.localStorage,
        });
        const handleClickIconEye = jest.fn((icon) =>
          billS.handleClickIconEye(icon)
        );
        const eyeIconGroup = screen.getAllByTestId("icon-eye");
        eyeIconGroup.forEach((eyeIcon) =>
        eyeIcon.addEventListener('click', (e) => handleClickIconEye(eyeIcon))
        ); 
        userEvent.click(eyeIconGroup[0]); 
        expect(handleClickIconEye).toHaveBeenCalled();
        await waitFor(() => document.getElementById("modaleFile"))
        expect(handleClickIconEye).toHaveBeenCalled();
        const modal = document.getElementById('modaleFile');
        expect(modal).toBeVisible();
        });
      }); 
    

      // Groupe de tests pour le clic sur l'icône de l'œil
describe('When I click on the eye icon to display the bill', () => { 
  // Espionne la méthode "bills" avant chaque test
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");
  });
  // Test pour vérifier l'ouverture de la fenêtre modale
  test('A modal should open', async () => {
    // Configure localStorage pour le test
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    // Simule un utilisateur connecté
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
    // Prépare l'interface utilisateur pour le test
    document.body.innerHTML = BillsUI({ data: bills });
    // Fonction de navigation pour le test
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    // Crée une instance de Bills pour le test
    const billS = new Bills({
      document,
      onNavigate,
      store: null,
      bills: bills,
      localStorage: window.localStorage,
    });
    // Fonction mock pour tester le clic sur l'icône
    const handleClickIconEye = jest.fn((icon) => billS.handleClickIconEye(icon));
    // Récupère les icônes de l'œil
    const eyeIconGroup = screen.getAllByTestId("icon-eye");
    // Ajoute un écouteur de clic à chaque icône
    eyeIconGroup.forEach((eyeIcon) =>
      eyeIcon.addEventListener('click', (e) => handleClickIconEye(eyeIcon))
    ); 
    // Simule un clic sur la première icône
    userEvent.click(eyeIconGroup[0]); 
    // Vérifie que la fonction mock a été appelée
    expect(handleClickIconEye).toHaveBeenCalled();
    // Attend que l'élément modal soit présent
    await waitFor(() => document.getElementById("modaleFile"))
    // Vérifie que la fonction mock a été appelée
    expect(handleClickIconEye).toHaveBeenCalled();
    // Récupère la fenêtre modale
    const modal = document.getElementById('modaleFile');
    // Vérifie que la fenêtre modale est visible
    expect(modal).toBeVisible();
  });
});
    //   ///-------------- TEST n° 3  --------------///

    //     // récupère les note de frais de l'API et s'il échoue : message d'erreur 404
    //     test("fetches bills from an API and fails with 404 message error", async () => {
    //       // (fct jest :mockImplementationOnce=simule la mise en œuvre une fois)
    //       // par une simulation unique,bills renvoie les objets fictifs du mockStore ( cad les notes de frais fictives)
    //       mockStore.bills.mockImplementationOnce(() => {
    //         return {
    //           //returne une propriété liste qui contient toutes les notes de frais si non (:)
    //           list: () => {
    //             // returne une promesse de reject donc un échec et crée un message d'erreur 404.
    //             return Promise.reject(new Error("Erreur 404"));
    //           },
    //         };
    //       });
    //       // renvoie l'utilisateur sur la page Bills
    //       window.onNavigate(ROUTES_PATH.Bills);
    //       //process.nextTick(callback...), qui est un node utilitaire qui ajoute le rappel passé à la file d'attente nextTick. La file d'attente nextTick est exécutée une fois que tous les événements de la boucle d'événements en cours sont terminés .
    //       await new Promise(process.nextTick);
    //       //stocke ds const message, renvoi le text de l'écran précisé entre parenthèses. les // entre parenthèses signifient qu'il va prendre en compte le texte, même si le texte Erreur 404 est imbriqué entre des balises (cad même si les mots erreur et 404 sont séparé par des balises ( div, span ou autre.)
    //       const message = screen.getByText(/Erreur 404/);
    //       expect(message).toBeTruthy();
    //     });
    //     // -------------AJOUT 3e TEST-----------
    //     // récupère les messages d'une API et échoue avec une erreur de message 500
    //     test("fetches messages from an API and fails with 500 message error", async () => {
    //       mockStore.bills.mockImplementationOnce(() => {
    //         return {
    //           list: () => {
    //             return Promise.reject(new Error("Erreur 500"));
    //           },
    //         };
    //       });
  
    //       window.onNavigate(ROUTES_PATH.Bills);
    //       await new Promise(process.nextTick);
    //       const message = screen.getByText(/Erreur 500/);
    //       expect(message).toBeTruthy();
    //     });
      
    

});

