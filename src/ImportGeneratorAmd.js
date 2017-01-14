class ImportGeneratorAmd {
  constructor(){
    this.counter = 0;
  }

  generate(importStatements) {
    const processedImportStatements = importStatements.map(statement => ({id: statement.id || this.generateId(), statement}));

    const dependencies = processedImportStatements
      .map(s=>s.statement.moduleName)
      .map(moduleName=>`"${moduleName}"`)
      .join(',');

    const dependencyNames = processedImportStatements
      .map(s=>s.id)
      .join(',');

    const mappedDependencies = processedImportStatements
      .map(({id, statement})=>this.formatImportMembers(id, statement.members))
      .filter(TokenizerUtils.filterEmpty)
      .join(';\n  ');

    return {
      dependencyList: `[${dependencies}]`,
      dependencyArguments: dependencyNames,
      dependencyMappings: mappedDependencies
    }
  }

  generateId() {
    return `__DEP${++this.counter}`
  }

  formatImportMembers(id, members) {
    return members.map((member)=>this.formatImportMember(id, member)).join(';');
  }

  formatImportMember(id, member){
    const name = member.name;
    const alias = member.alias || name;

    switch(member.type) {
      case "default":
        return `var ${alias} = ${id}.exports["default"]`;
      case "all":
        return `var ${alias} = ${id}.exports`;
      case "mapped":
        return `var ${alias} = ${id}.exports["${name}"]`;
      default:
        return '';
    }
  }
}