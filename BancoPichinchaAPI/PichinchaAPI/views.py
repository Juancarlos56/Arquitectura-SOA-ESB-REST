import decimal
from django.shortcuts import render
from .models import * 
from .serializers import * 
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from decimal import * 

class CuentaViewSet(viewsets.ModelViewSet):
  queryset = Cuenta.objects.all()
  serializer_class = CuentaSerializer

class AllTransferenciasViewSet(viewsets.ModelViewSet):
  queryset = Transferencia.objects.all()
  serializer_class = AllTransferenciasSerializer  



class AllTransferenciasCuentasViewSet(viewsets.ModelViewSet):
  queryset = Cuenta.objects.all()
  serializer_class = AllTransferenciasCuentasSerializer  



@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def crearTransferenciaCuenta(request):
  
  cedulaBeneficiario = request.data.get('cedulaBeneficiario')
  cuentaBeneficiario = request.data.get('cuentaBeneficiario')
  cedulaDepositante = request.data.get('cedulaDepositante')
  monto = 0.0
  try: 
    monto = float(request.data.get('monto'))
  except:
      return Response({"status": "error monto mal ingresado"}, status=status.HTTP_400_BAD_REQUEST)

  if cedulaBeneficiario!= "" and monto > 0.0 and cedulaDepositante != "":
    print("= cedulaBeneficiario",cedulaBeneficiario, " = ",cuentaBeneficiario)
    benefiario = 0
    try: 
      benefiario = Cuenta.objects.get(cedulaCliente=cedulaBeneficiario, numeroCuenta = cuentaBeneficiario) 
      depositante = Cuenta.objects.get(cedulaCliente=cedulaDepositante)  

    except: 
      print("Error en busqueda de cedula en benefiario o depositante")
      return Response(status=status.HTTP_404_NOT_FOUND) 
    
    if benefiario.montoCuenta > 0 and  benefiario.montoCuenta > monto:
      
    
      transaccionRetiroRegistrar = {
        'montoTransferencia' : ((-1)*(monto)),
        'tipoTransferencia' : "retiro",
        'cuenta' : depositante.id
      }
      
      transaccionDepositoRegistrar = {
        'montoTransferencia' : monto,
        'tipoTransferencia' : "deposito",
        'cuenta' : benefiario.id
      }
      
      transaccionRetiroRegistrar_serializer = TransaccionSerializerObjects(data=transaccionRetiroRegistrar)
      transaccionDepositoRegistrar_serializer = TransaccionSerializerObjects(data=transaccionDepositoRegistrar)
      
      if transaccionRetiroRegistrar_serializer.is_valid() == True and transaccionDepositoRegistrar_serializer.is_valid() == True:
        transaccionRetiroRegistrar_serializer.save()
        transaccionDepositoRegistrar_serializer.save()
        benefiario.montoCuenta = benefiario.montoCuenta + decimal.Decimal(monto)
        depositante.montoCuenta = depositante.montoCuenta - decimal.Decimal(monto)
        
        benefiario.save()
        depositante.save()
        
        return Response({"status":"Transferencia Realizada"},status=status.HTTP_200_OK) 
  
      return Response(transaccionRetiroRegistrar_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"status": "No cuenta con dinero"}, status=status.HTTP_400_BAD_REQUEST)
  else:
    return Response({"status": "error cedula mal ingresada o monto inferior a 0"}, status=status.HTTP_400_BAD_REQUEST)