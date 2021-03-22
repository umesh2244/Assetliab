public with sharing class AssetsLiabController {
        @AuraEnabled(cacheable=true)
        public static List<AssetWrapper> getAssetsList() {
            LisT<AssetWrapper> awList = new List<AssetWrapper>();
            List<Asset> assets = new List<Asset>();
            for(Asset ass : [SELECT Id,Name,AccountId, Status, Price,Type__c, Balance__c  from Asset]){
                AssetWrapper aw = new AssetWrapper();
                aw.id = ass.Id;
                aw.Name = ass.Name;
                aw.AccountId = ass.AccountId;
                aw.Status = ass.Status;
                aw.Price = ass.Price;
                aw.netWorth = ass.Price;
                aw.assetsTotal = ass.Price;
                aw.liabilitiesTotal = ass.Price;
                aw.Type = ass.Type__c;
                aw.Balance = ass.Balance__c;
               // assets.add(ass);
               aw.asset=ass;
                awList.add(aw);
            }
           
            return awList;
        }

        @AuraEnabled(cacheable=true)
        public static List<Asset> getAssetsListt() {           
            return [SELECT Id,Name,AccountId, Status, Price,Type__c, Balance__c from Asset];
        }

        @AuraEnabled
        public static void deleteAssets(list<Id> lstAssetIds){
            try {
                list<Asset> lstAssetsToDelete = new list<Asset>();
                System.debug('lstAssetIds ====> '+lstAssetIds);
                for(Id idAsset : lstAssetIds) {
                    lstAssetsToDelete.add(new Asset(Id = idAsset));
                }
                if(!lstAssetsToDelete.isEmpty()) {
                    delete lstAssetsToDelete;
                }
            }
            catch(Exception ex) {
                throw new AuraHandledException(ex.getMessage());
            }
        }

        public class AssetWrapper{
            @AuraEnabled public Id id{get;set;}
            @AuraEnabled public String Name{get;set;}
            @AuraEnabled public Id AccountId{get;set;}
            @AuraEnabled public String Status{get;set;}
            @AuraEnabled public Double Price {get;set;}
            @AuraEnabled public Double netWorth {get;set;}
            @AuraEnabled public Double assetsTotal {get;set;}
            @AuraEnabled public Double liabilitiesTotal {get;set;}
            @AuraEnabled public String Type{get;set;}
            @AuraEnabled public Double Balance{get;set;}
            @AuraEnabled public Asset asset {get;set;}
        }
    }