"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIBRARIES = exports.WORKFLOW_DASHBOARD = exports.PRODUCT_MAINTENANCE = exports.VALIDATOR_QUEUE = exports.CLASSIFICATION_QUEUE = exports.BUYER_QUEUE = exports.ALL_SPECS = exports.E2E_SPECS = exports.TEST_SPECS = void 0;
/**
 * Spec list for testing any specs.
 * This list should be manually configured as needed.
 */
exports.TEST_SPECS = [
    [
        '../../features/signUpTest.feature'
    ]
];
exports.E2E_SPECS = [
    [
    // '../../features/e2e.feature'
    ]
];
/**
 * Spec list containing all avaliable specs. (Complete regression)
 * This list should always be updated when a new spec is created.
 */
exports.ALL_SPECS = [
    [
        '../../features/view_fcc.feature',
        '../../features/create_fcc.feature',
        '../../features/update_fcc.feature',
        '../../features/view_ddc_class.feature',
        '../../features/create_ddc_class.feature',
        '../../features/update_ddc_class.feature',
        '../../features/view_ddc_division.feature',
        '../../features/create_ddc_code.feature',
        '../../features/update_ddc_code.feature',
        '../../features/view_ddc_department.feature',
        '../../features/create_ddc_department.feature',
        '../../features/update_ddc_department.feature',
        '../../features/view_ddc_merch_class.feature',
        '../../features/create_ddc_merch_class.feature',
        '../../features/update_ddc_merch_class.feature',
        '../../features/view_workflow_dashboard.feature'
    ],
    [
        '../../features/view_season_code.feature',
        '../../features/create_season_code.feature',
        '../../features/update_season_code.feature',
        '../../features/view_company.feature',
        '../../features/create_company.feature',
        '../../features/update_company.feature',
        '../../features/view_Itemtype.feature',
        '../../features/create_Item_type.feature',
        '../../features/update_Item_type.feature',
        '../../features/view_traitvalue.feature',
        '../../features/create_traitvalue.feature',
        '../../features/update_traitvalue.feature',
        '../../features/view_classification_queue.feature',
        '../../features/trait_matrix.feature',
    ],
    [
        '../../features/view_merchantoffice_vp.feature',
        '../../features/create_new_vp_merchantoffice.feature',
        '../../features/update_vp_merchantoffice.feature',
        '../../features/view_merchantoffice_director.feature',
        '../../features/create_new_director_merchantoffice.feature',
        '../../features/update_director_merchantoffice.feature',
        '../../features/view_merchantoffice_buyer.feature',
        '../../features/create_new_buyer_merchantoffice.feature',
        '../../features/update_buyer_merchantoffice.feature',
    ],
    [
        '../../features/view_buyer_queue.feature',
        '../../features/view_buyer_approval.feature',
        '../../features/preview_price.feature',
        '../../features/view_product_search.feature',
        '../../features/view_product_info.feature',
        '../../features/view_product_info_media_tab.feature'
    ],
    [
        '../../features/view_validator_queue.feature',
        '../../features/edit_approval_rules.feature',
        '../../features/complete_item.feature',
        '../../features/send_notification.feature',
        '../../features/reject_item.feature',
        '../../features/assign_validator_to_product.feature'
    ],
    [
        '../../features/approve_item.feature',
        '../../features/update_buyerapproval.feature',
        '../../features/edit_product_info.feature',
        '../../features/long_description.feature',
        '../../features/update_attribute.feature',
        '../../features/validation_table.feature'
    ],
    [
        // '../../features/signUpTest.feature',
        // '../../features/signInTest.feature'
        '../../features/signUpTest.feature'
    ]
    // 
];
/**
 * Spec list containing all Buyer Queue/Approval related specs.
 */
exports.BUYER_QUEUE = [
    [
        '../../features/view_buyer_queue.feature',
        '../../features/view_buyer_approval.feature',
        '../../features/preview_price.feature'
    ],
    [
        '../../features/approve_item.feature',
        '../../features/update_buyerapproval.feature'
    ],
    [
        '../../features/reject_item.feature',
        '../../features/edit_approval_rules.feature'
    ]
];
/**
 * Spec list containing all Classification Queue related specs.
 */
exports.CLASSIFICATION_QUEUE = [
    [
        '../../features/view_classification_queue.feature'
    ]
];
/**
 * Spec list containing all Validator Queue related specs.
 */
exports.VALIDATOR_QUEUE = [
    [
        '../../features/send_notification.feature',
        '../../features/validation_table.feature',
        '../../features/trait_matrix.feature'
    ],
    [
        '../../features/view_validator_queue.feature',
        '../../features/assign_validator_to_product.feature'
    ],
    [
        '../../features/update_attribute.feature'
    ]
];
/**
 * Spec list containing all Product Maintenance related specs.
 */
exports.PRODUCT_MAINTENANCE = [
    [
        '../../features/view_product_search.feature',
        '../../features/view_product_info.feature',
        '../../features/view_product_info_media_tab.feature'
    ],
    [
        '../../features/complete_item.feature',
        '../../features/long_description.feature'
    ],
    [
        '../../features/edit_product_info.feature'
    ]
];
/**
 * Spec list containing all Workflow Dashboard related specs.
 */
exports.WORKFLOW_DASHBOARD = [
    [
        '../../features/view_workflow_dashboard.feature'
    ]
];
/**
 * Spec list containing all Library related specs.
 */
exports.LIBRARIES = [
    [
        '../../features/view_fcc.feature',
        '../../features/create_fcc.feature',
        '../../features/update_fcc.feature',
        '../../features/view_ddc_class.feature',
        '../../features/create_ddc_class.feature',
        '../../features/update_ddc_class.feature',
        '../../features/view_ddc_division.feature',
        '../../features/create_ddc_code.feature',
        '../../features/update_ddc_code.feature',
        '../../features/view_ddc_department.feature',
        '../../features/create_ddc_department.feature',
        '../../features/update_ddc_department.feature',
        '../../features/view_ddc_merch_class.feature',
        '../../features/create_ddc_merch_class.feature',
        '../../features/update_ddc_merch_class.feature',
    ],
    [
        '../../features/view_season_code.feature',
        '../../features/create_season_code.feature',
        '../../features/update_season_code.feature',
        '../../features/view_company.feature',
        '../../features/create_company.feature',
        '../../features/update_company.feature',
        '../../features/view_Itemtype.feature',
        '../../features/create_Item_type.feature',
        '../../features/update_Item_type.feature',
        '../../features/view_traitvalue.feature',
        '../../features/create_traitvalue.feature',
        '../../features/update_traitvalue.feature',
    ],
    [
        '../../features/view_merchantoffice_vp.feature',
        '../../features/create_new_vp_merchantoffice.feature',
        '../../features/update_vp_merchantoffice.feature',
        '../../features/view_merchantoffice_director.feature',
        '../../features/create_new_director_merchantoffice.feature',
        '../../features/update_director_merchantoffice.feature',
        '../../features/view_merchantoffice_buyer.feature',
        '../../features/create_new_buyer_merchantoffice.feature',
        '../../features/update_buyer_merchantoffice.feature',
    ]
];
