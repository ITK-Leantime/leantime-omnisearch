@extends($layout)

@section('content')

<x-global::pageheader :icon="'fa fa-puzzle-piece'">
    <h1>OmniSearch Settings</h1>
</x-global::pageheader>


<div class="maincontent">
<?php echo $tpl->displayNotification(); ?>
    <div class="maincontentinner">
        <h5 class="subtitle">Omnisearch Settings</h5>
        <p style="padding-bottom: 15px">These settings will change the way the OmniSearch plugin works.</p>
        <h4 class="widgettitle title-light"><span class="fa fa-cog"></span>
            Cache expiration durations
        </h4>
        <form class="" method="post" id="" action="<?=BASE_URL ?>/OmniSearch/settings">
            <div class="row">
                <div class="col-md-2">
                    <label>Projects (minutes)</label>
                </div>
                <div class="col-md-8">
                    <input type="number" min="0" value="<?php echo (int) $tpl->get('projectCacheExpiration'); ?>" name="projectCacheExpiration" />
                </div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    <label>Tickets (minutes)</label>
                </div>
                <div class="col-md-8">
                    <input type="number" min="0" value="<?php echo (int) $tpl->get('ticketCacheExpiration'); ?>" name="ticketCacheExpiration" />
                </div>
            </div>
            <input type="submit" value="Save" id="saveBtn" />
        </form>

    </div>
</div>
@endsection
