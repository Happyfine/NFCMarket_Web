/* Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   select1.js
 *
 * DESCRIPTION
 *   Executes a basic query without using a ResultSet.
 *   Uses Oracle's sample HR schema.
 *
 *   Scripts to create the HR schema can be found at:
 *   https://github.com/oracle/db-sample-schemas
 *
 *****************************************************************************/

var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var Good = require('./Good.js');
var async = require('async');
var DataBase = function(){
     
}
module.exports = DataBase;
//搜素
DataBase.prototype.selectFromWhole=function(query,num,callback){
   var list = new Array();
   oracledb.getConnection(
        {
          user          : dbConfig.user,
          password      : dbConfig.password,
          connectString : dbConfig.connectString
        },
        function(err, connection)
        {
          if (err) {
            console.error(err.message);
            return;
          }
          connection.execute(
            query,
            [],
            function(err, result)
            {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
      //        console.log(result.metaData);
      //        console.log(result.rows.length);
      //        console.log(result.rows[0].length);
              for(var i=0;i<result.rows.length;i++){
                      var exec="new Good(";
                        for(var j=0;j<num;j++){
                             exec = exec+"result.rows["+i+"]["+j+"],";
                        }
                        exec=exec.substring(0,exec.length-1);
                        exec = exec+");"
                        // console.log("执行语句是："+exec);
                        var good = eval(exec);
                        list[i]=good;       
              }
              doRelease(connection);
              if(num == 1){
                   callback(result.rows[0][0]); 
              }else{
                   callback(list);
              }
            }); 
        });
}
//删除,更新，插入数据
DataBase.prototype.Changeinfo=function(sdelete,commit,callback){
      oracledb.getConnection(
        {
          user          : dbConfig.user,
          password      : dbConfig.password,
          connectString : dbConfig.connectString
        },
        function(err, connection)
        {
          if (err) {
            console.error(err.message);
            return;
          }
          connection.execute(
           sdelete,
            [],{autoCommit:commit},
            function(err, result)
            {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              // console.log(result.rowsAffected);
              doRelease(connection);
              callback();
            });
        });

}

function doRelease(connection)
{
  connection.release(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
  
