import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from "src/environments/environment";
@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

    constructor(public dialog: MatDialog,
		private http: HttpClient,
		private router: Router,
		private route: ActivatedRoute,
		private dataS: DataService,
		private changeDetectorRefs: ChangeDetectorRef) {

	this.route.url.subscribe(params => {
	    //console.log(params);
	    
	    if (params[0].path === 'edit') {
		this.id = params[1].path
		if (this.id) {
		    this.isNew = false
		    this.dataS.getOne(this.id, true)
		}
	    } else {
		this.isNew = true;
	    }
	})
	this.subscribtions[0] = this.dataS.onEdit.subscribe((data) => {
	    this.project = data.body
	    //console.log(data);
	    this.dataSource.data = this.project.financials;
	    this.dataSources.data = this.project.rewards;

	});
	this.subscribtions[1] = this.dataS.onImg.subscribe(data => {
	    this.project.images.push(...data.images);
	    this.submitForm();
	    this.uploading = false;
	    //console.log('evint');

	})
	this.subscribtions[2] = this.dataS.onRmImg.subscribe(data => {
	    this.project.images.forEach((im, i) => {
		if (data.uri === im.uri) {
		    this.project.images.splice(i, 1);
		}
	    })
	})
	//console.log('constructed');
	
    }

    
    fieldOptions= [
	"رياضي",
	"ثقافي",
	"فني",
	"جوالة",
	"علمي",
	"اجتماعي",
	"خدمات عامة",
	"أسر ورحلات",
    ]

    rewardRanks= [1,2,3,4,5,6,7,8,9,10]
    subscribtions = []

    ress = {
	type: null,
	body: null,
    }
    comp = this;
    dataSource = new MatTableDataSource();
    dataSources = new MatTableDataSource();

    isNew = true;
    submitForm() {
	this.res = this.dataS.submitForm(this.isNew, {
	    id: this.id,
	    project: this.project,
	}, true)
    }

    displayedColumns = ['name', 'budget', 'type', 'notes', 'delete'];
    // displayedColumnss = ['name', 'fac', 'type', 'notes', 'delete'];
    displayedColumnss = ['name', 'type', 'notes', 'delete'];

    financial = {
	name: null,
	budget: null,
	type: null,
	notes: null,
	add: () => {
	    this.project.financials.push({
		name: this.financial.name,
		budget: this.financial.budget,
		type: this.financial.type,
		notes: this.financial.notes
	    });

	    this.financial.name = null;
	    this.financial.budget = null;
	    this.financial.type = null;
	    this.financial.notes = null;

	    this.dataSource.data = this.project.financials;
	},
	delete: (x) => {
	    this.project.financials.splice(x, 1);
	    this.dataSource.data = this.project.financials;
	}
    };
    reward = {
	name: null,
	// fac: null,
	type: null,
	notes: null,
	add: () => {
	    this.project.rewards.push({
		name: this.reward.name,
		// fac: this.reward.fac,
		type: this.reward.type,
		notes: this.reward.notes
	    });

	    this.reward.name = null;
	    // this.reward.fac = null;
	    this.reward.type = null;
	    this.reward.notes = null;

	    this.dataSources.data = this.project.rewards;
	},
	delete: (x) => {
	    this.project.rewards.splice(x, 1);
	    this.dataSources.data = this.project.rewards;
	}
    };

    host = env.host;

    objectivesColor = [];
    partnersColor = [];
    programsColor = [];
    financialsColor = [];
    rewardsColor = [];
    objective = null;
    partner = null;
    program = null;
    id = null;
    project = {
	id: null,
	faculty: null,
	name: null,
	created_at: null,
	updated_at: null,
	field: null,
	objectives: [],
	images: [],
	date: null,
	place: null,
	targeted_boys: null,
	targeted_girls: null,
	targeted_staff: null,
	targeted_others: null,
	targeted_specialneeds: null,
	outside_partners: [],
	programs: [],
	financials: [],
	rewards: []
    };
    res = {
	type: null,
	body: null
    };

    img(uri) {
	return env.api.form.images.dist(uri)
    }
    add = {
	objective: () => {
	    this.project.objectives.push({ objective: this.objective });
	    this.objectivesColor.push('primary');
	    this.objective = ''
	},
	partner: () => {
	    this.project.outside_partners.push({ partner: this.partner });
	    this.partnersColor.push('primary');
	    this.partner = ''
	},
	program: () => {
	    this.project.programs.push({ program: this.program });
	    this.programsColor.push('primary');
	    this.program = ''
	},
    }
    delete = {
	objective: (x) => {
	    this.project.objectives.splice(x, 1);
	    this.objectivesColor.splice(x, 1)
	},
	partner: (x) => {
	    this.project.outside_partners.splice(x, 1);
	    this.partnersColor.splice(x, 1)
	},
	program: (x) => {
	    this.project.programs.splice(x, 1);
	    this.programsColor.splice(x, 1)
	}
    }

    rmImg(uri) {

	const dialogRef = this.dialog.open(DeleteImgDialog, {
	    width: 'auto',
	    data: {
		delete: null,
		uri
	    }
	});

	dialogRef.afterClosed().subscribe(result => {
	    if (result) {
		this.dataS.deleteFile(uri);
	    }
	});

    }

    onFileSelected(event) {

	this.selectedFiles = [];
	for (const file of event.target.files) {
	    if (file.type.slice(0,5)=='image' && file.size < 2097152) {
		this.selectedFiles.push(file)
	    }
	}

	

	//this.selectedFiles = event.target.files;
	//console.log(this.selectedFiles.length);

    }


    hasErrors= false;
    getValidationErrors(){
	let errors: string[] = [];
	if(!this.project.name) {
	    errors.push("name error");
	}	
	return errors;
    }

    
    selectedFiles = []
    uploading = false;
    upload() {
	if(this.getValidationErrors().length!=0) {
	    this.hasErrors == true;
	    return;
	}
	if (this.selectedFiles.length != 0) {
	    this.uploading = true;
	    this.dataS.upload(this.selectedFiles);
	} else {
	    this.submitForm();
	}

    }

    ngOnInit() {

    }
    
    ngOnDestroy() {
	this.subscribtions.forEach(el =>{
	    el.unsubscribe();
	})
    }

}
@Component({
    selector: 'delete-img-dialog',
    templateUrl: 'delete.html',
})
export class DeleteImgDialog {

    constructor(
	public dialogRef: MatDialogRef<DeleteImgDialog>,
	@Inject(MAT_DIALOG_DATA) public data) { }

    img(uri) {
	return env.api.form.images.dist(uri)
    }

    action(state): void {
	this.data.delete = state;
	this.dialogRef.close(this.data.delete);
    }
    validation = ''

}
