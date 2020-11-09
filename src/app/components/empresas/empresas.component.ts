import { Component, OnInit } from '@angular/core';
import { Empresas } from "../../models/empresas";
import { EmpresasService } from "../../services/empresas.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
    Titulo:String = "Empresas";
	  TituloAccionABMC = {
      A: "(Agregar)",
	    L: "(Listado)"

	  };
	  Empresas: Empresas[] = [];
	  empresa: Empresas;
	  AccionABMC:string = "L";
	    Mensajes = {
	    RD: " Revisar los datos ingresados..."
	  };
	  SinBusquedasRealizadas = true;
	
	  FormReg: FormGroup;
	  submitted = false;

  constructor(    
    public formBuilder: FormBuilder,
    private empresasService: EmpresasService,
    private modalDialogService: ModalDialogService
              ) { }

  ngOnInit() {    
    this.Buscar();
    this.Resetear();

  }

  Resetear(){
    this.FormReg = this.formBuilder.group({
      IdEmpresa: [0],
      CantidadEmpleados: [null, [Validators.required, Validators.pattern("[0-9]{1,300}")]],
      FechaFundacion: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
          )
        ]
      ],
      RazonSocial: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)]
      ],
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.Resetear();
    this.FormReg.reset(this.FormReg.value);
    this.submitted = false;
    this.FormReg.markAsUntouched(); 
  }

  Volver(){
    this.AccionABMC = "L";
  }

Grabar() {
      this.submitted = true;
    // verificar que los validadores esten OK
     if (this.FormReg.invalid) {
      return;
    }

    const itemCopy = { ...this.FormReg.value };

    var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaFundacion = 
          new Date(
            arrFecha[2],
            arrFecha[1] - 1,
            arrFecha[0]
          ).toISOString();

    // agregar post
    if (itemCopy.IdEmpresa == 0 || itemCopy.IdEmpresa == null) {
      this.empresasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      this.empresasService
        .put(itemCopy.IdEmpresa, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.Buscar();
        });
        }
    }

    Buscar() {
    this.SinBusquedasRealizadas = false;
    this.empresasService
      .get()
      .subscribe((res:Empresas[]) => {
        this.Empresas = res;
      });
    }


}