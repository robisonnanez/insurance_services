<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cashreceipt extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'cashreceipts';
    protected $primaryKey = 'id';

    protected $fillable = [
        'clients_id',
        'numberdocument',
        'date',
        'hour',
        'total',
        'paying'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->logExcept([
                'created_at',
                'updated_at',
                'deleted_at',
            ])
            ->dontSubmitEmptyLogs();
    }
}
