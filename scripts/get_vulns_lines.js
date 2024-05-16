#!/usr/bin/env node

(async () => {
    const fs = require('fs')

    const getSolidityFiles = (dir, filelist) => {
        files = fs.readdirSync(dir) 
        filelist = filelist || [] 
        files.forEach(function(file) {
        file_type = file.split(".").pop() 
          if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = getSolidityFiles(dir + '/' + file, filelist) 
          }
          else if (file_type == "sol") {
            const contract_dir = dir + '/' + file
            const vuln_cat = dir.split("/").pop() 
            const params = {
                name: file,
                path: contract_dir,
                cat: vuln_cat
            }
            filelist.push(params) 
          }
        }) 
        return filelist 
    } 
    
    const getResults = () => {
        const results = []
        const contracts = getSolidityFiles('dataset')
        const pragmaRegex = /pragma\s+solidity\s+[^\d]*(.*?);/;
        contracts.forEach(contract => {
            let vulnerabilities = []
            let result = {
                name: contract.name,
                path: contract.path,
                pragma: '',
                source: '',
                vulnerabilities: vulnerabilities
            }
            const contract_lines = fs.readFileSync(contract.path).toString().split("\n") 
            contract_lines.forEach(line => {
                let contract_source, vuln_at_lines

                //get source
                if (line.includes('@source:')) {
                    contract_source = line.split("@source:").pop() 
                    result.source = contract_source.trim()
                    return
                }
                //get vuln lines
                if (line.includes('@vulnerable_at_lines')) {
                    vuln_at_lines = line.split("@vulnerable_at_lines: ").pop() 
                    const lines = vuln_at_lines.split(",")
                    
                    for (let index = 0; index < lines.length; index++){
                        let vuln
                        let vuln_flow = [] 
                        if((parseInt(lines[index]) + 1) === parseInt(lines[index + 1])){
                            while((parseInt(lines[index]) + 1) === parseInt(lines[index + 1])){
                                vuln_flow.push(parseInt(lines[index]))
                                index+=1
                            }
                            vuln_flow.push(parseInt(lines[index]))
                            vuln = {
                                lines: vuln_flow,
                                category: contract.cat
                            }
                        }

                        else{
                            vuln_flow.push(parseInt(lines[index]))
                            vuln = {
                                lines: vuln_flow,
                                category: contract.cat
                            }
                        }
                        vulnerabilities.push(vuln)
                    }
                    
                    return
                }

                //get pragma version
                const match = line.match(pragmaRegex);
                if (match && match.length > 1) {
                    result.pragma = match[1].trim();
                    return
                }
                })
            
            results.push(result)
        }) 
        return results
    }

    const result = getResults()
    fs.writeFileSync('vulnerabilities.json', JSON.stringify(result))
    process.exit() 
  })()
