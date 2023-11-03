/**
 * @jest-environment jsdom
 */


import {fireEvent, screen, waitFor} from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
/****----ADD IMPORT---***/
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";
import { formatDate, formatStatus } from "../app/format.js";
import router from "../app/Router.js";
import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI";


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
        }
        document.body.innerHTML = BillsUI({data : bills}) 
        const bill = new Bills({
        document, 
        onNavigate, 
        store: null, 
        bills, 
        localStorage: window.localStorage
        });
        const handleClickNewBill = jest.fn((e) => bill.handleClickNewBill(e)); 
        const newBill = screen.getByTestId('btn-new-bill'); 
        newBill.addEventListener("click", handleClickNewBill); 
        newBill.click();
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy() 
        });
      })
       ///------------ TEST n° 2 ----------------///
       
    describe('When I click on the eye icon to display the bill', () => { 
      test('A modal should open', () => {
      const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
      }))
      bills[0].fileUrl = "test.jpg";
      document.body.innerHTML = BillsUI({data: bills}); 
      const eyeBill = new Bills({
      document, onNavigate, store: null, bills, localStorage: window.localStorage
      });
      $.fn.modal = jest.fn() 
      let eye = screen.getAllByTestId('icon-eye'); 
      console.log (eye)
      const handleClickIconEye = jest.fn((e) => eyeBill.handleClickIconEye(eye[0])); 
      eye[0].addEventListener('click', handleClickIconEye); 
      fireEvent.click(eye[0]); 
      expect(handleClickIconEye).toHaveBeenCalled();
      const modale = document.getElementById('modaleFile');
      expect(modale).toBeTruthy();
      expect($.fn.modal).toHaveBeenCalled();
      });
    });    
      


});

