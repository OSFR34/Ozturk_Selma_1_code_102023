/**
 * @jest-environment jsdom
 */


/*-------ADDING THE FOLLOWING LINE------*/
import "@testing-library/jest-dom";
// screen permet de sélectionner des éléments qu'on un attribut spécifique)
import { screen, waitFor} from "@testing-library/dom";
/*-------ADDING THE FOLLOWING LINE------*/
//permet la simulation des interactions des utilisateurs avec le DOM.
import userEvent from "@testing-library/user-event";
/*-------ADDING THE FOLLOWING LINE------*/
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
/*-------ADDING THE FOLLOWING LINE------*/
import mockStore from "../__mocks__/store.js";
/*-------ADDING THE FOLLOWING LINE------*/
import { ROUTES } from "../constants/routes.js";
import router from "../app/Router.js";


/*-------ADDING THE FOLLOWING LINE------*/
jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'})
        );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');

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
  ///**************ADDING NEW TESTS**************///
  ///--------------- TEST n° 1 ------------------///
  describe("When I click on the new bill button", () => { 
    test("a new bill form should open", () => {
      /*--- Préparation de l'environnement du test ---*/
      const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));        
      const myBills = new Bills({
      document, 
      onNavigate, 
      store: mockStore, 
      bills: bills, 
      localStorage: window.localStorage
      });
      document.body.innerHTML = BillsUI({data : bills}); 
      /*--- Fin de la préparation de l'environnement ---*/
      const MockHandleClickNewBill = jest.fn((e) => myBills.handleClickNewBill(e)); 
      const newBillBtn = screen.getByText('Nouvelle note de frais'); 
      newBillBtn.addEventListener("click", MockHandleClickNewBill); 
      newBillBtn.click();
      expect(MockHandleClickNewBill).toHaveBeenCalled();
      const newBillPageHeader = screen.queryByText("Envoyer une note de frais");
      expect(newBillPageHeader).toBeTruthy();
      document.body.innerHTML = "";
    });
  });

  ///--------------- TEST n° 2 ----------------///
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
      };
      
      const myBills = new Bills({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });
      const handleClickIconEye = jest.fn((icon) =>
        myBills.handleClickIconEye(icon)
      );
      const eyeIconGroup = screen.getAllByTestId("icon-eye");
      eyeIconGroup.forEach((eyeIcon) =>
      eyeIcon.addEventListener('click', (e) => handleClickIconEye(eyeIcon))
      ); 
      userEvent.click(eyeIconGroup[0]); 
      expect(handleClickIconEye).toHaveBeenCalled();
      await waitFor(() => document.getElementById("modaleFile"));
      expect(handleClickIconEye).toHaveBeenCalled();
      const modal = document.getElementById('modaleFile');
      expect(modal).toBeVisible();
    });
  }); 
});    
  ///-------------- TEST n° 3 et 4 ----------------/// 
describe("Given I am connected as an employee", () => { 
  describe("When an error occurs on API", () => {
    /*--- Preparing the environment for tests 3 and 4--*/
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(window,"localStorage",{ 
        value: localStorageMock 
      });
      window.localStorage.setItem(
        'user', 
        JSON.stringify({type: "Employee",email: "a@a"
        })        
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });
    /*---------- End of preparation-------------*/
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });
      window.onNavigate(ROUTES_PATH.Bills);
      /* "process.nextTick" fct Node.js : permet d’attendre que toutes les promesses 
       en attente soient résolues avant de vérifier les résultats du test.*/
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    ///-------------- TEST n° 4 ----------------///
    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });  
});
    




 


