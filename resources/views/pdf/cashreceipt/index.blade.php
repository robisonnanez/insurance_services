<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recibo de Caja</title>

    <style>
      body {
        font-family: DejaVu Sans, sans-serif;
        font-size: 12px;
        color: #000;
      }

      .container {
        width: 100%;
        padding: 10px;
      }

      .info {
        margin-top: 20px;
        width: 100%;
      }

      .info-table {
        width: 100%;
      }

      .info-table td {
        padding: 4px 0;
      }

      .servicios {
        margin-top: 20px;
        width: 100%;
        border-collapse: collapse;
      }

      .servicios th,
      .servicios td {
        border-bottom: 1px solid #000;
        padding: 6px;
      }

      .servicios th {
        text-align: left;
      }

      .text-right {
        text-align: right;
      }

      .totales {
        margin-top: 15px;
        width: 100%;
      }

      .totales td {
        padding: 4px;
      }

      .suma {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        font-weight: bold;
      }

      .suma .valor {
        font-size: 20px;
      }

      .firma {
        margin-top: 40px;
        width: 100%;
      }

      .firma-linea {
        width: 200px;
        border-top: 1px solid #000;
        text-align: center;
        padding-top: 5px;
        font-size: 11px;
      }

      .nota {
        font-size: 10px;
        margin-top: 10px;
      }

      .watermark-image {
        position: fixed;
        top: 40%;
        left: 30%;
        width: 400px;
        opacity: 0.08;
        transform: translate(-50%, -50%);
        z-index: -1;
      }

      .watermark-text {
        position: fixed;
        top: 45%;
        left: 20%;
        transform: translate(-50%, -50%) rotate(-35deg);
        font-size: 70px;
        color: rgba(200, 0, 0, 0.12);
        font-weight: bold;
        z-index: -1;
        text-transform: uppercase;
        white-space: nowrap;
      }
    </style>
</head>
<body>
<div class="container">

  <img
    src="{{ public_path($logo) }}"
    class="watermark-image"
    alt="Marca de agua"
  >

  {{-- Watermark text --}}
  @if(!$cashreceipt->paying)
    <div class="watermark-text">
      NO HA CANCELADO
    </div>
  @endif

    {{-- INFORMACIÓN PRINCIPAL --}}
    <div class="info">
      <table class="info-table">
        <tr>
          <td width="50%">
            <strong>Fecha:</strong> {{ $cashreceipt->date }}<br>
            <strong>Recibí de:</strong> {{ $cashreceipt->client->fullname }}<br>
            <strong>Cédula:</strong> {{ $cashreceipt->client->document }}
          </td>

          <td width="50%">
            <strong>Dirección:</strong> {{ $cashreceipt->client->address }}<br>
            <strong>Teléfono:</strong> {{ $cashreceipt->client->cellphone ? $cashreceipt->client->cellphone : 'N/A' }}
          </td>
        </tr>
      </table>
    </div>

    {{-- TABLA SERVICIOS --}}
    <table class="servicios">
      <thead>
        <tr>
          <th width="15%">Doc. Refe</th>
          <th>Detalle</th>
          <th width="20%" class="text-right">Valor</th>
        </tr>
      </thead>
      <tbody>
        @foreach($cashreceipt->cashreceiptdetails as $i => $details)
          <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $details->name }}</td>
            <td class="text-right">
              $ {{ number_format($details->price, 0, ',', '.') }}
            </td>
          </tr>
        @endforeach
      </tbody>
    </table>

    {{-- SUMA --}}
    <div class="suma">
      <div>La suma de:</div>
      <div class="valor">
        $ {{ number_format($cashreceipt->total, 0, ',', '.') }}
      </div>
    </div>

    {{-- TOTALES --}}
    <table class="totales">
      <tr>
        <td class="text-right"><strong>Subtotal:</strong></td>
        <td class="text-right" width="20%">
          $ {{ number_format($cashreceipt->total, 0, ',', '.') }}
        </td>
      </tr>
      <tr>
        <td class="text-right"><strong>Total:</strong></td>
        <td class="text-right">
          $ {{ number_format($cashreceipt->total, 0, ',', '.') }}
        </td>
      </tr>
    </table>

    {{-- FIRMA --}}
    <div class="firma">
      <table width="100%">
        <tr>
          <td width="40%">
            <div class="firma-linea">Firma y Sello</div>
          </td>
          <td width="60%" class="nota">
            Nota: Apreciado cliente, por favor conserve este recibo como soporte de su pago.
          </td>
        </tr>
      </table>
    </div>
</div>

</body>
</html>
